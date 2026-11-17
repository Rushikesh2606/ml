import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Leaf, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/models', label: 'Models' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/detect', label: 'Detect' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change (via NavLink active state change)
  const closeMobile = () => setIsOpen(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        'bg-gray-950/90 backdrop-blur-md border-b border-white/5',
        scrolled && 'shadow-xl shadow-black/40'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMobile}>
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-leaf-600/20 border border-leaf-500/30 group-hover:bg-leaf-600/30 transition-colors">
              <Leaf className="w-5 h-5 text-leaf-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-leaf-400 to-leaf-300 text-lg tracking-tight">
                PhytoTurboNet
              </span>
              <span className="text-[10px] text-gray-500 tracking-wider uppercase">
                Crop Disease Research
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
                    isActive
                      ? 'text-leaf-400'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 bg-leaf-500/10 border border-leaf-500/20 rounded-md -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/detect"
              onClick={closeMobile}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-leaf-600 hover:bg-leaf-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-leaf-900/30 border border-leaf-500/30"
            >
              <Zap className="w-3.5 h-3.5" />
              Try Detector
            </Link>

            <button
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden border-t border-white/5 bg-gray-950/95 backdrop-blur-md"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-leaf-500/10 text-leaf-400 border border-leaf-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
              <Link
                to="/detect"
                onClick={closeMobile}
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-leaf-600 hover:bg-leaf-500 text-white text-sm font-medium transition-all duration-200"
              >
                <Zap className="w-3.5 h-3.5" />
                Try Detector
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
