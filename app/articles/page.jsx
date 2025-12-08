'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Search, BookOpen } from 'lucide-react';
import { Header, Footer, CustomCursor } from '../../components/Layout';

const ARTICLES = [
  {
    id: 1,
    title: 'Understanding AI Vision Technology in Creative Analysis',
    excerpt: 'Explore how modern AI vision systems decode visual elements, from color theory to composition analysis.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    readTime: '8 min read',
    date: 'Dec 5, 2024',
    featured: true,
  },
  {
    id: 2,
    title: 'From Screenshot to JSON: The Complete Workflow',
    excerpt: 'A step-by-step guide to extracting structured metadata from any advertisement or design.',
    category: 'Tutorial',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop',
    readTime: '12 min read',
    date: 'Dec 3, 2024',
    featured: true,
  },
  {
    id: 3,
    title: 'Brand Safety in the Age of AI: Avoiding Copyright Pitfalls',
    excerpt: 'Learn how to create inspired designs without infringing on trademarks or copyrights.',
    category: 'Legal',
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
    readTime: '6 min read',
    date: 'Dec 1, 2024',
    featured: false,
  },
  {
    id: 4,
    title: 'The Science of Lighting in Product Photography',
    excerpt: 'How AI identifies and categorizes lighting setups for perfect recreations.',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop',
    readTime: '10 min read',
    date: 'Nov 28, 2024',
    featured: false,
  },
  {
    id: 5,
    title: 'Color Theory for Digital Designers: An AI Perspective',
    excerpt: 'Discover how VIMA analyzes color palettes and suggests harmonious combinations.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop',
    readTime: '7 min read',
    date: 'Nov 25, 2024',
    featured: false,
  },
  {
    id: 6,
    title: 'Prompt Engineering: From Analysis to Generation',
    excerpt: 'How to use VIMA\'s structured output to create perfect prompts for image generators.',
    category: 'Tutorial',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    readTime: '15 min read',
    date: 'Nov 22, 2024',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Technology', 'Tutorial', 'Legal', 'Photography', 'Design'];


export default function Articles() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = ARTICLES.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 overflow-x-hidden selection:bg-amber-200">
      <CustomCursor cursorVariant={cursorVariant} cursorText={cursorText} />
      
      <Header setCursorVariant={setCursorVariant} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block border border-stone-900 text-stone-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Articles & Guides
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              Learn from the experts
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8">
              Insights, tutorials, and best practices for creative professionals using AI-powered design analysis.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-full pl-12 pr-6 py-4 text-stone-900 focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-6 md:px-12 bg-stone-50 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {selectedCategory === 'All' && !searchQuery && (
        <section className="py-12 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="text-amber-600" size={24} />
              <h2 className="text-2xl font-bold">Featured</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => {
                    setCursorVariant('text');
                    setCursorText('Read');
                  }}
                  onMouseLeave={() => {
                    setCursorVariant('default');
                    setCursorText('');
                  }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[16/10] mb-6">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-stone-500 mb-3">
                    <span className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full font-medium">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 mb-4">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-2 text-amber-700 font-medium group-hover:gap-4 transition-all">
                    Read article
                    <ArrowRight size={16} />
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* All Articles */}
      <section className="py-12 px-6 md:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">
            {selectedCategory === 'All' && !searchQuery ? 'All Articles' : `${filteredArticles.length} Results`}
          </h2>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === 'All' && !searchQuery ? regularArticles : filteredArticles).map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-lg transition-shadow"
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
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-stone-500 mb-3">
                      <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full font-medium">
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-stone-600 text-sm line-clamp-2">{article.excerpt}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 md:px-12 bg-stone-950">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay in the loop
            </h2>
            <p className="text-stone-400 mb-8">
              Get the latest articles, tutorials, and product updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}
