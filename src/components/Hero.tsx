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
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-background-white overflow-hidden pt-20 py-30">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <Camera className="absolute top-10 left-4 sm:top-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 text-accent animate-pulse" />
        <Camera className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 text-accent animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className={`text-center px-6 sm:px-8 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium tracking-extra-wide mb-8 sm:mb-12 text-accent">
          VINEET LABDHE
        </h2>

        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-wide mb-10 sm:mb-16 text-primary leading-tight">
          <span className="inline-block px-0">
            Portfolio
          </span>
        </h1>

        <p className="font-sans text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide mb-4 sm:mb-6 text-text-primary font-light">
          Visual Storyteller
        </p>

        <p className="font-sans text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide text-text-secondary font-light">
          Photographer | Cinematographer
        </p>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-12 sm:bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce"
        aria-label="Scroll down"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-slow">
          <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8 text-accent group-hover:text-white" />
        </div>
      </button>
    </section>
  );
}
