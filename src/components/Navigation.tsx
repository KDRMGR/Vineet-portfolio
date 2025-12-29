import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Prevent scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Cinematography', href: '/cinematography' },
    { name: 'Photography', href: '/photography' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-slow ${
          isScrolled ? 'bg-background-white/95 backdrop-blur-md py-4 shadow-sm' : 'bg-background-white/80 backdrop-blur-sm py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-center space-x-8 lg:space-x-12">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`font-sans text-sm lg:text-base uppercase tracking-extra-wide hover:text-accent transition-slow font-medium ${
                    location.pathname === link.href ? 'text-accent' : 'text-text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between">
            <Link to="/" className="font-display text-accent font-bold text-xl uppercase tracking-wider">
              VL
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary hover:text-accent transition-smooth"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-background-white/98 backdrop-blur-md z-40 md:hidden transition-slow ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: isScrolled ? '64px' : '80px' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-10 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-display text-3xl sm:text-4xl uppercase tracking-wide hover:text-accent transition-slow font-medium ${
                location.pathname === link.href ? 'text-accent' : 'text-text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
