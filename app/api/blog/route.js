const DATABASE_ID = "2c58c947508880629accc700da1efecc";

function richTextToMarkdown(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return "";

  return richTextArray
    .map((rt) => {
      let text = rt.plain_text || "";
      if (!rt.annotations) return text;

      if (rt.annotations.code) text = `\`${text}\``;
      if (rt.annotations.bold) text = `**${text}**`;
      if (rt.annotations.italic) text = `*${text}*`;
      if (rt.annotations.strikethrough) text = `~~${text}~~`;
      if (rt.href) text = `[${text}](${rt.href})`;

      return text;
    })
    .join("");
}

function blockToMarkdown(block) {
  const type = block.type;
  const content = block[type];

  if (!content) return "";

  switch (type) {
    case "paragraph":
      return richTextToMarkdown(content.rich_text) + "\n";

    case "heading_1":
      return `# ${richTextToMarkdown(content.rich_text)}\n`;

    case "heading_2":
      return `## ${richTextToMarkdown(content.rich_text)}\n`;

    case "heading_3":
      return `### ${richTextToMarkdown(content.rich_text)}\n`;

    case "bulleted_list_item":
      return `- ${richTextToMarkdown(content.rich_text)}\n`;

    case "numbered_list_item":
      return `1. ${richTextToMarkdown(content.rich_text)}\n`;

    case "to_do": {
      const checked = content.checked ? "x" : " ";
      return `- [${checked}] ${richTextToMarkdown(content.rich_text)}\n`;
    }

    case "toggle":
      return `<details><summary>${richTextToMarkdown(content.rich_text)}</summary></details>\n`;

    case "code": {
      const lang = content.language || "";
      return `\`\`\`${lang}\n${richTextToMarkdown(content.rich_text)}\n\`\`\`\n`;
    }

    case "quote":
      return `> ${richTextToMarkdown(content.rich_text)}\n`;

    case "divider":
      return "---\n";

    case "image": {
      const imageUrl = content.type === "file"
        ? content.file?.url
        : content.external?.url;
      const caption = richTextToMarkdown(content.caption || []);
      return imageUrl ? `![${caption}](${imageUrl})\n` : "";
    }

    case "callout": {
      const icon = content.icon?.emoji || "";
      return `> ${icon} ${richTextToMarkdown(content.rich_text)}\n`;
    }

    case "bookmark":
      return content.url ? `[${content.url}](${content.url})\n` : "";

    default:
      return "";
  }
}

async function getDatabase() {
  const res = await fetch(
    `https://api.picaos.com/v1/passthrough/v1/databases/${DATABASE_ID}`,
    {
      method: "GET",
      headers: {
        "x-pica-secret": process.env.PICA_SECRET_KEY,
        "x-pica-connection-key": process.env.PICA_NOTION_CONNECTION_KEY,
        "x-pica-action-id": "conn_mod_def::GHfWYW_uJ4s::iK4x1-LFRzSF3oXLlDdhrA",
        "Content-Type": "application/json",
      },
    }
  );
  return await res.json();
}

async function queryDataSource(dataSourceId) {
  const res = await fetch(
    `https://api.picaos.com/v1/passthrough/data_sources/${dataSourceId}/query`,
    {
      method: "POST",
      headers: {
        "x-pica-secret": process.env.PICA_SECRET_KEY,
        "x-pica-connection-key": process.env.PICA_NOTION_CONNECTION_KEY,
        "x-pica-action-id": "conn_mod_def::GHfWZCu-4SU::-mgQyb4cQjeJWdQMXbTlAg",
        "Content-Type": "application/json",
        "Notion-Version": "2025-09-03",
      },
      body: JSON.stringify({}),
    }
  );
  return await res.json();
}

async function getBlockChildren(blockId) {
  const allBlocks = [];
  let startCursor = null;
  let hasMore = true;

  while (hasMore) {
    const url = new URL(
      `https://api.picaos.com/v1/passthrough/v1/blocks/${blockId}/children`
    );
    if (startCursor) url.searchParams.set("start_cursor", startCursor);
    url.searchParams.set("page_size", "100");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-pica-secret": process.env.PICA_SECRET_KEY,
        "x-pica-connection-key": process.env.PICA_NOTION_CONNECTION_KEY,
        "x-pica-action-id": "conn_mod_def::GHfWW7Y1vJI::OhkLT7UYRsulsfhxS031cg",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    });

    const data = await res.json();
    allBlocks.push(...(data.results || []));
    hasMore = data.has_more || false;
    startCursor = data.next_cursor;
  }

  return allBlocks;
}

function extractPageProperties(page) {
  const properties = page.properties;
  if (!properties) return { title: "", description: "", image: "" };

  let title = "";
  let description = "";
  let image = "";

  for (const [key, property] of Object.entries(properties)) {
    if (property.type === "title") {
      title = property.title?.map((t) => t.plain_text).join("") || "";
    }

    if (property.type === "rich_text" && key.toLowerCase().includes("description")) {
      description = property.rich_text?.map((t) => t.plain_text).join("") || "";
    }

    if (property.type === "files") {
      const files = property.files;
      if (files && files.length > 0) {
        const file = files[0];
        image = file.type === "file" ? file.file?.url || "" : file.external?.url || "";
      }
    }

    if (property.type === "url" && key.toLowerCase().includes("image")) {
      image = property.url || "";
    }
  }

  if (!image && page.cover) {
    image = page.cover.type === "file"
      ? page.cover.file?.url || ""
      : page.cover.external?.url || "";
  }

  return { title, description, image };
}

function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export async function GET() {
  try {
    const database = await getDatabase();

    if (!database.data_sources || !Array.isArray(database.data_sources)) {
      return Response.json(
        { error: "No data sources found in database" },
        { status: 400 }
      );
    }

    const allPages = [];
    for (const ds of database.data_sources) {
      const pagesResponse = await queryDataSource(ds.id);
      if (pagesResponse.results) {
        allPages.push(...pagesResponse.results);
      }
    }

    const blogPosts = await Promise.all(
      allPages.map(async (page) => {
        const pageId = page.id;
        const { title, description, image } = extractPageProperties(page);

        const blocks = await getBlockChildren(pageId.replace(/-/g, ""));
        const markdown = blocks.map(blockToMarkdown).join("\n");

        return {
          id: pageId,
          title,
          description: truncateText(description || markdown.replace(/[#*`>\-[\]]/g, "").trim()),
          image,
          content: markdown,
          createdAt: page.created_time,
          updatedAt: page.last_edited_time,
        };
      })
    );

    return Response.json({ posts: blogPosts });
  } catch (error) {
    return Response.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
