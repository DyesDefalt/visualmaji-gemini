import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useSpring, useMotionValue, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, ScanLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Custom Cursor Component
export const CustomCursor = ({ cursorVariant, cursorText }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [mouseX, mouseY]);

  const variants = {
    default: {
      height: 16,
      width: 16,
      backgroundColor: "#a68b5b",
      mixBlendMode: "normal"
    },
    hover: {
      height: 64,
      width: 64,
      backgroundColor: "#a68b5b",
      opacity: 0.5,
      mixBlendMode: "multiply"
    },
    text: {
      height: 120,
      width: 120,
      backgroundColor: "#1a1610",
      color: "#FFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mixBlendMode: "normal"
    },
    magnetic: {
      height: 32,
      width: 32,
      backgroundColor: "#a68b5b",
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[100] flex items-center justify-center text-xs font-bold text-white text-center"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: "-50%",
        y: "-50%",
      }}
      variants={variants}
      animate={cursorVariant}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {cursorVariant === 'text' && cursorText}
    </motion.div>
  );
};

// Magnetic Button Component
export const MagneticButton = ({ children, className, onClick, setCursorVariant, as: Component = 'button', to, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e) => {
    if (to) {
      e.preventDefault();
      navigate(to);
    }
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { reset(); setCursorVariant('default'); }}
      onMouseEnter={() => setCursorVariant('magnetic')}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Navigation Overlay
const NavOverlay = ({ isOpen, onClose, links, setCursorVariant }) => {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 bg-stone-950 z-[90] flex flex-col items-center justify-center text-white"
        >
          <div className="flex flex-col space-y-6 items-center">
            {links.map((link, index) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className="text-4xl md:text-7xl font-bold hover:text-amber-600 transition-colors tracking-tighter"
                onClick={() => handleLinkClick(link.path)}
                onMouseEnter={() => setCursorVariant('magnetic')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {link.name}
              </motion.button>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8 }}
            className="absolute bottom-10 left-10 md:left-20 text-sm opacity-50"
          >
            hello@visualmaji.com <br/> Prompt Reverse Engineering
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Header Component with centered glass effect navigation
export const Header = ({ setCursorVariant }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Articles', path: '/articles' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const allNavLinks = [
    ...navLinks,
    { name: 'Dashboard', path: '/dashboard' },
    { name: user ? 'Logout' : 'Login', path: user ? '/' : '/login' },
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-[80] px-6 py-4 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo - Left */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group z-50" 
            onMouseEnter={() => setCursorVariant('hover')} 
            onMouseLeave={() => setCursorVariant('default')}
          >
            <div className="border-2 border-current rounded-full p-1 group-hover:rotate-180 transition-transform duration-500 text-stone-900 mix-blend-difference">
              <ScanLine size={28} className="text-white" />
            </div>
            <span className="font-bold text-xl hidden md:block tracking-wide text-white mix-blend-difference">VIMA</span>
          </Link>

          {/* Centered Glass Navigation */}
          <motion.nav 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-300 ${
              isScrolled 
                ? 'glass-header-dark shadow-lg' 
                : 'glass-header'
            }`}
          >
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                onMouseEnter={() => setCursorVariant('magnetic')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <Link 
                to="/dashboard" 
                className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors ml-2"
                onMouseEnter={() => setCursorVariant('magnetic')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-100 transition-colors ml-2"
                onMouseEnter={() => setCursorVariant('magnetic')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                Login
              </Link>
            )}
          </motion.nav>

          {/* Menu Button - Right */}
          <button 
            className="z-[95]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onMouseEnter={() => setCursorVariant('magnetic')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <motion.div 
              className={`p-3 rounded-full transition-all duration-300 ${
                isMenuOpen 
                  ? 'bg-white text-stone-900' 
                  : isScrolled 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white text-stone-900'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </header>

      <NavOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        links={allNavLinks}
        setCursorVariant={setCursorVariant}
      />
    </>
  );
};

// Footer Component - Earth tones
export const Footer = ({ setCursorVariant }) => {
  return (
    <footer className="bg-stone-950 text-white px-6 py-20 md:px-12 relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32 relative z-10">
        <div>
          <h3 className="text-3xl md:text-5xl font-medium mb-8">
            Ready to reverse engineer your first ad? <br/>
            <span className="text-stone-500">Ensure Brand Safety with VIMA.</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            <MagneticButton 
              className="bg-white text-stone-900 px-6 py-3 rounded-full font-bold hover:bg-amber-500 hover:text-white transition-colors" 
              setCursorVariant={setCursorVariant}
              to="/dashboard"
            >
              Launch App
            </MagneticButton>
            <MagneticButton 
              className="border border-white/20 px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors" 
              setCursorVariant={setCursorVariant}
              to="/pricing"
            >
              View Pricing
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/10 pt-12 relative z-10">
        <div className="mb-8 md:mb-0">
          <h1 className="text-[15vw] leading-none font-bold tracking-tighter opacity-100 select-none">
            VIMA
          </h1>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm text-stone-400">
          <div>
            <h5 className="text-white font-bold mb-4">Product</h5>
            <Link to="/" className="block hover:text-white transition-colors">Visual Maji Web</Link>
            <Link to="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
            <Link to="/dashboard" className="block hover:text-white transition-colors">Dashboard</Link>
            <p className="mt-4 text-white">hello@visualmaji.com</p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Company</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/articles" className="hover:text-white transition-colors">Articles</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Connect</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-white font-medium">System Operational</span>
            </div>
            <p className="max-w-xs">Powered by Best AI Vision. Safely Commercializing Generative AI.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
