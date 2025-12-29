import { ChevronDown, Camera } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <Camera className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 animate-pulse" />
        <Camera className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className={`text-center px-4 sm:px-6 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-6 sm:mb-8 text-[#ff8c42]">
          Vineet Labdhe
        </h2>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.5em] mb-6 sm:mb-8">
          <span className="inline-block border-4 sm:border-6 md:border-8 border-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">
            Portfolio
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-3 sm:mb-4">
          Visual Storyteller
        </p>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400">
          Photographer | Cinematographer
        </p>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce"
        aria-label="Scroll down"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </button>
    </section>
  );
}
