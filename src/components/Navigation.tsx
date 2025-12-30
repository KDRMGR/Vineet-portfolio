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
          isScrolled ? 'bg-black/90 py-3' : 'bg-black/50 py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10">
          {/* Desktop Navigation - Centered with tighter spacing */}
          <ul className="hidden md:flex items-center justify-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`font-sans text-xs uppercase tracking-widest hover:text-white transition-all duration-300 font-normal ${
                    location.pathname === link.href ? 'text-white' : 'text-gray-400'
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
            <Link to="/" className="font-display text-yellow-500 font-semibold text-sm uppercase tracking-wider">
              MV
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-yellow-500 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: isScrolled ? '56px' : '72px' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-display text-xl uppercase tracking-wider hover:text-yellow-500 transition-all duration-300 font-semibold ${
                location.pathname === link.href ? 'text-yellow-500' : 'text-white'
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