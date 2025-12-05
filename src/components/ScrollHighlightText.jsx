import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Individual word component that highlights based on scroll
const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ['#6b7280', '#ffffff']);
  
  return (
    <motion.span 
      style={{ opacity, color }} 
      className="inline-block mr-[0.25em] transition-colors"
    >
      {children}
    </motion.span>
  );
};

// Scroll Highlight Text Component
const ScrollHighlightText = ({ text, className = '' }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25']
  });

  // Split text into words
  const words = text.split(' ');

  return (
    <p ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={index} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default ScrollHighlightText;
