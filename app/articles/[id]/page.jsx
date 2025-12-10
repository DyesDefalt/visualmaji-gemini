'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Header, Footer, CustomCursor } from '../../../components/Layout';
import { ARTICLES } from '../../../lib/articles-data';

export default function ArticlePage() {
  const params = useParams();
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');

  const article = ARTICLES.find((a) => a.id === params.id);

  if (!article) {
    return (
      <div className="min-h-screen bg-stone-950 font-sans text-white">
        <Header setCursorVariant={setCursorVariant} />
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Article not found</h1>
          <p className="text-stone-400 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to articles
          </Link>
        </div>
        <Footer setCursorVariant={setCursorVariant} />
      </div>
    );
  }

  const relatedArticles = ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-white overflow-x-hidden selection:bg-amber-200">
      <CustomCursor cursorVariant={cursorVariant} cursorText={cursorText} />

      <Header setCursorVariant={setCursorVariant} />

      <article className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-white mb-8 transition-colors"
              onMouseEnter={() => setCursorVariant('link')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              <ArrowLeft size={20} />
              Back to articles
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="bg-amber-600/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium border border-amber-600/30">
                {article.category}
              </span>
              {article.featured && (
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-stone-400 mb-8">
              {article.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 mb-12 pb-8 border-b border-stone-800">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {article.readTime}
              </span>
              <button
                className="ml-auto flex items-center gap-2 text-stone-400 hover:text-white transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.description,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </motion.div>

          {article.image && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12 rounded-2xl overflow-hidden"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert prose-stone prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-white
              prose-h1:text-4xl prose-h1:mb-6
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-stone-300 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-amber-300
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-amber-300 prose-code:bg-stone-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-stone-800
              prose-pre:bg-stone-900 prose-pre:text-stone-100 prose-pre:border prose-pre:border-stone-800
              prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-stone-400
              prose-ul:my-6 prose-ol:my-6
              prose-li:text-stone-300 prose-li:mb-2
              prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-stone-800
              prose-hr:border-stone-800 prose-hr:my-12
              prose-table:border prose-table:border-stone-800
              prose-th:bg-stone-900 prose-th:text-white prose-th:border prose-th:border-stone-800
              prose-td:border prose-td:border-stone-800 prose-td:text-stone-300"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="py-16 px-6 bg-stone-900/30 border-t border-stone-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link href={`/articles/${relatedArticle.id}`} key={relatedArticle.id}>
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800 hover:border-stone-700 hover:bg-stone-900/70 transition-all"
                    onMouseEnter={() => {
                      setCursorVariant('text');
                      setCursorText('Read');
                    }}
                    onMouseLeave={() => {
                      setCursorVariant('default');
                      setCursorText('');
                    }}
                  >
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
                        <span className="bg-stone-800 text-stone-300 px-3 py-1 rounded-full font-medium">
                          {relatedArticle.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {relatedArticle.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-amber-500 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-stone-400 text-sm line-clamp-2">
                        {relatedArticle.description}
                      </p>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}
