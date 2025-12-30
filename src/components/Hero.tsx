import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['fashion & lifestyle', 'corporate events', 'concerts', 'people & places', 'nightlife'];

  useEffect(() => {
    // Cycle through words every 2.5 seconds (slower than before)
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Animated text overlay - positioned exactly like reference */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
        <div className="text-center w-full max-w-4xl">
          {/* Name - smaller and lighter like reference */}
          <h2 className="font-display text-[10px] xs:text-xs sm:text-sm md:text-base font-normal tracking-[0.3em] mb-3 xs:mb-4 sm:mb-6 text-yellow-500 uppercase animate-fadeIn" style={{letterSpacing: '0.4em'}}>
            VINEET LABDHE
          </h2>

          {/* Image with overlaid heading - tighter positioning */}
          <div className="relative mx-auto mb-6 sm:mb-8 w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 overflow-hidden animate-slideUp">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
              alt="Vineet Labdhe"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Portfolio text overlay - positioned lower and tighter */}
            <div className="pointer-events-none absolute -bottom-2 xs:-bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-full px-2">
              <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-[0.15em] text-white leading-none animate-slideInLeft whitespace-nowrap" style={{letterSpacing: '0.2em'}}>
                PORTFOLIO
              </h1>
            </div>
          </div>

          {/* Visual Storyteller - smaller and tighter spacing */}
          <p className="font-sans text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.2em] mb-2 text-white font-light uppercase animate-slideInRight px-2" style={{letterSpacing: '0.25em'}}>
            VISUAL STORYTELLER
          </p>

          {/* Director line - smaller and lighter */}
          <p className="font-sans text-[9px] xs:text-[10px] sm:text-xs md:text-sm tracking-[0.15em] text-gray-400 font-light uppercase animate-fadeIn px-2" style={{letterSpacing: '0.2em'}}>
            DIRECTOR • PHOTOGRAPHER • CINEMATOGRAPHER
          </p>
        </div>
      </div>

      {/* Rotating words at bottom - positioned like reference */}
      <div className="absolute bottom-20 xs:bottom-24 left-1/2 -translate-x-1/2 text-center px-4 w-full">
        <div className="relative h-5 xs:h-6">
          {words.map((word, index) => (
            <span
              key={word}
              className={`absolute left-1/2 -translate-x-1/2 font-sans text-[10px] xs:text-xs sm:text-sm uppercase tracking-[0.15em] text-gray-300 transition-all duration-500 whitespace-nowrap ${
                index === currentWordIndex
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-1'
              }`}
              style={{letterSpacing: '0.2em'}}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll button - smaller and more subtle */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-6 xs:bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 xs:w-10 xs:h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all"
        aria-label="Scroll to about"
      >
        <ChevronDown className="w-3 h-3 xs:w-4 xs:h-4" />
      </button>
    </section>
  );
}