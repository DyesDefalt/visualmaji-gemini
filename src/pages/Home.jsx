import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Database, ShieldCheck, ArrowRight } from 'lucide-react';
import { Header, Footer, CustomCursor, MagneticButton } from '../components/Layout';
import ScrollHighlightText from '../components/ScrollHighlightText';

/* --- Mock Data & Assets --- */
const RECIPES = [
  { id: 1, title: 'Luxury Perfume', category: 'Octane Render', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, title: 'Neon Cyberpunk', category: 'Bokeh Lighting', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop' },
  { id: 3, title: 'Organic Skincare', category: 'Softbox', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop' },
  { id: 4, title: 'Sneaker Campaign', category: 'Brand Guard Safe', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop' },
];

const JOURNAL_POSTS = [
  { id: 1, title: 'Best AI Vision: The Engine Behind Visual Analysis', category: 'Tech', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600' },
  { id: 2, title: 'From Screenshot to JSON: The Workflow', category: 'Tutorial', image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600' },
  { id: 3, title: 'Brand Safety: Avoid Copyright Traps', category: 'Legal', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600' },
];

// Hero Floating Image
const FloatingImage = ({ src, alt, className, speed = 1 }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);
  
  return (
    <motion.div 
      style={{ y }} 
      className={`absolute ${className} pointer-events-none z-10`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
       <motion.img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover rounded-md shadow-2xl"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
       />
    </motion.div>
  );
};

export default function Home() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');

  // Parallax Text Effect
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 overflow-x-hidden selection:bg-amber-200">
      <CustomCursor cursorVariant={cursorVariant} cursorText={cursorText} />
      
      <Header setCursorVariant={setCursorVariant} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-100">
        <div className="absolute inset-0 w-full h-full bg-stone-200 opacity-10 pattern-grid-lg" />
        
        {/* Floating Elements - "Ads" to be analyzed */}
        <FloatingImage 
          src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400" 
          alt="Floating Ad 1"
          className="w-48 md:w-64 top-[15%] left-[5%] md:left-[10%] rotate-[-6deg]" 
          speed={1.5} 
        />
        <FloatingImage 
          src="https://images.unsplash.com/photo-1605648916361-9bc12ad6a569?q=80&w=400" 
          alt="Floating Ad 2"
          className="w-40 md:w-56 bottom-[20%] left-[5%] md:left-[15%] rotate-[12deg]" 
          speed={1.2} 
        />
        <FloatingImage 
          src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=400" 
          alt="Floating Ad 3"
          className="w-52 md:w-72 top-[20%] right-[5%] md:right-[15%] rotate-[15deg]" 
          speed={2} 
        />
        <FloatingImage 
          src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400" 
          alt="Floating Ad 4"
          className="w-36 md:w-48 bottom-[15%] right-[10%] md:right-[20%] rotate-[-10deg]" 
          speed={0.8} 
        />

        {/* Main Text */}
        <motion.div 
          style={{ y: titleY, opacity: textOpacity }}
          className="z-20 text-center pointer-events-none"
        >
          <h1 className="text-[18vw] leading-none font-bold tracking-tighter select-none text-stone-900">
            VIMA
          </h1>
        </motion.div>
      </section>

      {/* Intro / Purpose Section */}
      <section className="bg-stone-950 text-white py-32 px-6 md:px-12 rounded-t-[3rem] -mt-20 relative z-30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ScrollHighlightText 
              text='Visual Maji is a web app tool for Prompt Reverse Engineering. We help creative professionals convert flattened screenshots into precise "Design Recipes".'
              className="text-3xl md:text-6xl font-medium leading-[1.2] mb-16"
            />
          </motion.div>

          <div className="flex justify-end relative h-40">
             <div className="absolute right-0 top-0 md:right-32 md:top-10">
                <MagneticButton 
                  className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-medium inline-flex items-center gap-2 hover:bg-amber-700 transition-colors"
                  setCursorVariant={setCursorVariant}
                  to="/dashboard"
                >
                  <Zap size={20} className="fill-current" />
                  Analyze Image
                </MagneticButton>
             </div>
             <motion.p 
              className="text-stone-400 max-w-md mt-24 text-lg md:text-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
             >
                Using Best AI Vision Technology, we break down ads into Subject, Medium, Lighting, and Composition.
             </motion.p>
          </div>
        </div>
      </section>

      {/* Design Recipes (Projects) Section */}
      <section className="bg-stone-50 py-32 px-4 md:px-12">
        <div className="max-w-8xl mx-auto">
          <div className="mb-16">
            <span className="border border-stone-900 rounded-full px-4 py-1 text-sm uppercase tracking-wider font-medium">Design Recipes</span>
            <h3 className="text-3xl md:text-5xl mt-6 font-medium max-w-3xl">
              Extracted structured metadata. From flattened pixels to precise, compliant prompt recipes:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {RECIPES.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                className={`group relative ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                onMouseEnter={() => {
                   setCursorVariant('text');
                   setCursorText('Extract');
                }}
                onMouseLeave={() => {
                   setCursorVariant('default');
                   setCursorText('');
                }}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                  <motion.img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  {/* JSON Overlay Mockup */}
                  <div className="absolute bottom-4 left-4 bg-stone-900/90 text-amber-400 p-4 rounded-lg font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {`{ "subject": "${recipe.title}", "medium": "${recipe.category}" }`}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h4 className="text-2xl font-bold">{recipe.title}</h4>
                  <div className="flex gap-2">
                    <span className="bg-stone-200 text-stone-700 px-3 py-1 rounded-full text-xs font-medium uppercase">{recipe.category}</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium uppercase flex items-center gap-1"><Database size={12}/> JSON Ready</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-32">
             <MagneticButton 
               className="bg-stone-900 text-white px-10 py-5 rounded-full text-xl font-medium hover:bg-amber-600 transition-colors"
               setCursorVariant={setCursorVariant}
               to="/dashboard"
             >
               Explore Recipe Library
             </MagneticButton>
          </div>
        </div>
      </section>

      {/* Forensic Analogy Section */}
      <section className="py-20 px-4 md:px-12 bg-stone-100">
        <div className="relative rounded-3xl overflow-hidden min-h-[80vh] w-full">
            <img 
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2000&auto=format&fit=crop" 
              alt="Forensic Lab" 
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
            />
            <div className="absolute inset-0 bg-amber-900/20 mix-blend-multiply" />
            
            <div className="absolute top-10 left-10">
               <span className="bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-600"/>
                  Forensic Ad Photography
               </span>
            </div>

            {/* Simulated interactive bubbles */}
            <motion.div 
               className="absolute top-1/3 left-1/4 bg-white px-4 py-3 rounded-xl rounded-bl-none shadow-xl text-sm font-mono text-amber-700"
               initial={{ opacity: 0, scale: 0 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
            >
               Analyzing Light Source...
            </motion.div>
             <motion.div 
               className="absolute bottom-1/3 right-1/4 bg-white px-4 py-3 rounded-xl rounded-br-none shadow-xl text-sm font-mono text-red-600"
               initial={{ opacity: 0, scale: 0 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5 }}
            >
               Trademark Detected: Brand Guard Active
            </motion.div>
        </div>
        
        <div className="bg-stone-950 text-white rounded-3xl p-12 md:p-24 mt-8 flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xl">
               <span className="border border-white/30 rounded-full px-3 py-1 text-xs uppercase tracking-wider mb-6 inline-block">The Concept</span>
               <h3 className="text-3xl md:text-5xl font-medium leading-tight">
                  Think of VIMA as a professional forensic photographer for digital advertising.
               </h3>
            </div>
            <div className="flex flex-col gap-6">
               <p className="text-stone-400 max-w-sm text-lg">
                  Instead of just taking a picture (like an image generator does), we examine the original piece of evidence—the ad screenshot—and issue an expert, structured report. This allows you to recreate compliant versions safely.
               </p>
               <MagneticButton 
                  className="bg-white text-stone-900 px-8 py-4 rounded-full font-bold self-start hover:bg-amber-500 hover:text-white transition-colors flex items-center gap-2"
                  setCursorVariant={setCursorVariant}
                  to="/dashboard"
               >
                  <ShieldCheck size={20} />
                  Start Brand Guard
               </MagneticButton>
            </div>
        </div>
      </section>

      {/* Journal / Tech Section */}
      <section className="py-32 px-4 md:px-12 overflow-hidden bg-stone-50">
        <div className="flex justify-between items-end mb-16">
           <div>
              <span className="border border-stone-900 rounded-full px-4 py-1 text-sm uppercase tracking-wider font-medium">Knowledge Base</span>
              <h2 className="text-4xl md:text-6xl font-medium mt-6 max-w-2xl">
                 Powered by Best AI Vision
              </h2>
           </div>
           <div className="hidden md:flex gap-4">
              <button className="p-4 border border-stone-300 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors">
                 <ArrowRight className="rotate-180" />
              </button>
              <button className="p-4 border border-stone-300 rounded-full hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors">
                 <ArrowRight />
              </button>
           </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide snap-x">
           {JOURNAL_POSTS.map((post) => (
              <motion.div 
                 key={post.id}
                 className="min-w-[300px] md:min-w-[400px] snap-center cursor-pointer group"
                 onMouseEnter={() => {
                    setCursorVariant('text');
                    setCursorText('Read');
                 }}
                 onMouseLeave={() => {
                    setCursorVariant('default');
                    setCursorText('');
                 }}
              >
                 <div className="overflow-hidden rounded-xl mb-6 aspect-square">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 </div>
                 <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase mb-3 inline-block">{post.category}</span>
                 <h3 className="text-2xl font-bold leading-tight group-hover:text-amber-700 transition-colors">{post.title}</h3>
                 <p className="mt-4 text-stone-500 underline underline-offset-4 text-sm group-hover:text-stone-900">Read article</p>
              </motion.div>
           ))}
        </div>
      </section>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}
