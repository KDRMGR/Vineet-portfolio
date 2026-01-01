import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ['fashion & lifestyle', 'corporate events', 'concerts', 'people & places', 'nightlife', 'wedding & others'];
  const [heroName, setHeroName] = useState('Vineet Labdhe');
  const [heroSubtitle, setHeroSubtitle] = useState('Visual Storyteller');
  const [heroTagline, setHeroTagline] = useState('Photographer • Cinematographer');
  const [backgroundUrl, setBackgroundUrl] = useState('/ref/home_hero.JPEG');
  const [portraitUrl, setPortraitUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after initial delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: heroContent } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'hero')
        .in('key', ['name', 'subtitle', 'tagline']);

      for (const row of heroContent || []) {
        if (row.key === 'name') setHeroName(row.value);
        if (row.key === 'subtitle') setHeroSubtitle(row.value);
        if (row.key === 'tagline') setHeroTagline(row.value);
      }

      const { data: heroMedia } = await supabase
        .from('gallery_images')
        .select('*')
        .in('category', ['home-hero-bg', 'home-hero-portrait'])
        .order('order_index', { ascending: true });

      const bg = (heroMedia || []).find((m) => m.category === 'home-hero-bg');
      const portrait = (heroMedia || []).find((m) => m.category === 'home-hero-portrait');

      if (bg?.image_url) setBackgroundUrl(bg.image_url);
      if (portrait?.image_url) setPortraitUrl(portrait.image_url);
    };

    load();
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        {backgroundUrl.match(/\.(mp4|webm|ogg)$/i) ? (
          <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-40">
            <source src={backgroundUrl} />
          </video>
        ) : (
          <img
            src={backgroundUrl}
            alt="Background"
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
        <div className="text-center">
          <h2 className="font-display text-xs sm:text-sm md:text-base font-light tracking-[0.4em] mb-8 sm:mb-10 md:mb-12 text-white uppercase overflow-hidden" style={{letterSpacing: '0.4em'}}>
            <span className={`inline-block ${showContent ? 'animate-slideDown' : 'opacity-0'}`}>
              {heroName.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    animation: showContent ? `fadeInChar 0.6s ease-out ${i * 0.05}s forwards` : 'none',
                    opacity: 0
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h2>

          {/* Portfolio Text with Image Behind */}
          <div className="relative flex items-center justify-center min-h-[16rem] sm:min-h-[20rem] md:min-h-[24rem]">
            {/* Image positioned behind and centered */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 overflow-hidden border-2 border-white/20 ${showContent ? 'animate-scaleIn' : 'opacity-0 scale-50'}`}
                 style={{animationDelay: '0.3s', animationFillMode: 'forwards', zIndex: 1}}>
              <img
                src={portraitUrl}
                alt={heroName}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Portfolio text in front */}
            <h1
              className="relative font-display text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-[0.12em] leading-none"
              style={{
                letterSpacing: '0.12em',
                fontFamily: 'Anton, "Bebas Neue", "League Spartan", sans-serif',
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)',
                color: 'transparent',
                zIndex: 2
              }}
            >
              {'PORTFOLIO'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    animation: showContent ? `slideInChar 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.5 + i * 0.08}s forwards` : 'none',
                    opacity: 0,
                    transform: 'translateY(100px)'
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>
          </div>
        </div>
      </div>

      {/* Rotating words at bottom */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center">
        <div className="relative h-6">
          {words.map((word, index) => (
            <span
              key={word}
              className={`absolute left-1/2 -translate-x-1/2 font-sans text-sm uppercase tracking-[0.2em] text-gray-400 transition-all duration-500 ${
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

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:border-white transition-all group"
        aria-label="Scroll to about"
      >
        <ChevronDown className="w-4 h-4 text-white group-hover:text-black transition-colors" />
      </button>
    </section>
  );
}
