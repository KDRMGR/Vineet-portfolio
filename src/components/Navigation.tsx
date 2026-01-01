import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    { name: 'Photography', href: '/photography' },
    { name: 'Cinematography', href: '/cinematography' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleBookNow = () => {
    navigate('/contact');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            {/* Center Menu */}
            <ul className="flex items-center space-x-12">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
                      location.pathname === link.href
                        ? 'text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Book Now Button */}
            <button
              onClick={handleBookNow}
              className="ml-12 px-6 py-2 border border-white text-white text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-end w-full">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: isScrolled ? '68px' : '84px' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-10 px-4 pb-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`font-display text-2xl uppercase tracking-[0.2em] transition-all duration-300 font-light ${
                location.pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleBookNow}
            className="mt-8 px-8 py-3 border border-white text-white text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </>
  );
}
