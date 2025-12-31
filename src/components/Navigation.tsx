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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 py-8' : 'bg-white/80 py-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          {/* Desktop Navigation - Centered with generous spacing */}
          <ul className="hidden md:flex items-center justify-center space-x-20 lg:space-x-24">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`font-sans text-sm uppercase tracking-widest hover:text-gray-900 transition-all duration-300 font-light ${
                    location.pathname === link.href ? 'text-gray-900' : 'text-gray-600'
                  }`}
                  style={{letterSpacing: '0.2em'}}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between">
            <Link to="/" className="font-display text-gray-900 font-light text-sm uppercase tracking-wider">
              VL
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: isScrolled ? '96px' : '120px' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-12 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-display text-2xl uppercase tracking-wider hover:text-gray-900 transition-all duration-300 font-light ${
                location.pathname === link.href ? 'text-gray-900' : 'text-gray-700'
              }`}
              style={{letterSpacing: '0.15em'}}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}