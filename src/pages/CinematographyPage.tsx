import { useEffect, useState } from 'react';
import { supabase, subscribeToCmsUpdates } from '../lib/supabase';
import { Video, Film, Play, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultCinematographyCategories = [
  { id: 'cinematography-highlight-reels', name: 'Highlight Reels' },
  { id: 'cinematography-wedding-social-media', name: 'Wedding Social Media' },
  { id: 'cinematography-short-films', name: 'Short Films' },
  { id: 'cinematography-social-media-event-decor', name: 'Social Media Event Decor' },
  { id: 'cinematography-tata-marathon', name: 'Tata Marathon' },
  { id: 'cinematography-starbucks', name: 'Starbucks' },
  { id: 'cinematography-others', name: 'Others' },
  { id: 'corporate', name: 'Corporate Events' },
  { id: 'concerts', name: 'Concerts' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'events', name: 'Events' },
  { id: 'documentary', name: 'Documentary' },
  { id: 'live', name: 'Live Shows' },
];

export default function CinematographyPage() {
  const [loading, setLoading] = useState(true);
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [heading, setHeading] = useState('Cinematography');
  const [subheading, setSubheading] = useState('Visual Storytelling Through Motion');
  const [categories, setCategories] = useState(defaultCinematographyCategories);
  const [covers, setCovers] = useState<Record<string, string>>({});

  const stripQuery = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url.split('?')[0] || url;
    }
  };

  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(stripQuery(url));

  const safeParseCategoryList = (raw: string | undefined) => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return null;
      const next: Array<{ id: string; name: string }> = [];
      for (const item of parsed) {
        if (!item || typeof item !== 'object') continue;
        const maybe = item as { id?: unknown; name?: unknown };
        if (typeof maybe.id !== 'string' || typeof maybe.name !== 'string') continue;
        const id = maybe.id.trim();
        const name = maybe.name.trim();
        if (!id || !name) continue;
        next.push({ id, name });
      }
      return next.length ? next : null;
    } catch {
      return null;
    }
  };

  const getYouTubeVideoId = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (host === 'youtu.be') {
        const id = parsed.pathname.split('/').filter(Boolean)[0];
        return id || null;
      }
      if (host.endsWith('youtube.com')) {
        const v = parsed.searchParams.get('v');
        if (v) return v;
        const segments = parsed.pathname.split('/').filter(Boolean);
        const embedIndex = segments.indexOf('embed');
        if (embedIndex >= 0 && segments[embedIndex + 1]) return segments[embedIndex + 1];
        const shortsIndex = segments.indexOf('shorts');
        if (shortsIndex >= 0 && segments[shortsIndex + 1]) return segments[shortsIndex + 1];
      }
    } catch {
      return null;
    }
    return null;
  };

  const getVimeoVideoId = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (!host.endsWith('vimeo.com')) return null;
      const segments = parsed.pathname.split('/').filter(Boolean);
      const id = segments[segments.length - 1];
      if (id && /^\d+$/.test(id)) return id;
    } catch {
      return null;
    }
    return null;
  };

  const getInstagramEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (!host.endsWith('instagram.com')) return null;
      const segments = parsed.pathname.split('/').filter(Boolean);
      const kind = segments[0];
      const shortcode = segments[1];
      if (!shortcode) return null;
      if (kind !== 'p' && kind !== 'reel' && kind !== 'tv') return null;
      return `https://www.instagram.com/${kind}/${shortcode}/embed`;
    } catch {
      return null;
    }
  };

  const getEmbedUrl = (url: string) => {
    const ytId = getYouTubeVideoId(url);
    if (ytId) {
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&rel=0&playsinline=1`;
    }
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1`;
    }
    const ig = getInstagramEmbedUrl(url);
    if (ig) return ig;
    return null;
  };

  useEffect(() => {
    let active = true;

    const fetchCovers = async (cats: typeof defaultCinematographyCategories) => {
      const ids = cats.map((c) => c.id);
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .in('category', ids)
        .order('order_index', { ascending: true });

      if (!active) return;
      const next: Record<string, string> = {};
      for (const id of ids) {
        const first = (data || []).find((row) => row.category === id);
        if (first?.image_url) next[id] = first.image_url;
      }
      setCovers(next);
    };

    const load = async () => {
      setLoading(true);

      const [
        { data: heroData },
        { data: contentData },
      ] = await Promise.all([
        supabase
          .from('gallery_images')
          .select('image_url')
          .eq('category', 'hero-cinematography')
          .order('order_index', { ascending: true })
          .limit(1),
        supabase
          .from('content')
          .select('key,value')
          .eq('section', 'cinematography')
          .in('key', ['heading', 'subheading', 'categories']),
      ]);

      if (!active) return;

      setHeroVideo(heroData?.[0]?.image_url || null);

      let nextHeading = 'Cinematography';
      let nextSubheading = 'Visual Storytelling Through Motion';
      let nextCategories = defaultCinematographyCategories;
      for (const row of contentData || []) {
        if (row.key === 'heading') nextHeading = row.value;
        if (row.key === 'subheading') nextSubheading = row.value;
        if (row.key === 'categories') {
          const parsed = safeParseCategoryList(row.value);
          if (parsed) nextCategories = parsed;
        }
      }
      setHeading(nextHeading);
      setSubheading(nextSubheading);
      setCategories(nextCategories);
      await fetchCovers(nextCategories);
      setLoading(false);
    };

    load();
    const unsubscribe = subscribeToCmsUpdates(() => load());
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Video */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          {heroVideo ? (
            isVideoFile(heroVideo) ? (
              <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-60">
                <source src={heroVideo} />
              </video>
            ) : getEmbedUrl(heroVideo) ? (
              <iframe
                className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
                src={getEmbedUrl(heroVideo) || undefined}
                title="Cinematography Hero Video"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                style={{
                  border: 'none',
                }}
              />
            ) : (
              <img src={heroVideo} alt="Cinematography Hero" className="w-full h-full object-cover opacity-60" />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black opacity-60" />
          )}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <div className="mb-12">
            <Film className="w-24 h-24 mx-auto mb-8 text-white" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-9xl font-light uppercase tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.15em] mb-8">
            {heading}
          </h1>
          <p className="font-sans text-lg sm:text-2xl md:text-3xl uppercase tracking-[0.12em] sm:tracking-[0.2em] md:tracking-[0.25em] mb-12 text-gray-400">
            {subheading}
          </p>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-justify mb-6" style={{letterSpacing: '0.02em', lineHeight: '1.8'}}>
              Creating dynamic visual narratives for corporate events, concerts, and commercial
              productions. Each project is crafted with precision, bringing stories to life through
              the lens with professional-grade equipment and 4K production quality.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify" style={{letterSpacing: '0.02em', lineHeight: '1.8'}}>
              From live music events to corporate conferences, I specialize in capturing the energy
              and emotion of every moment, delivering polished, impactful videos that resonate with
              audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-32 md:py-40 px-4 md:px-8 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-light uppercase tracking-wider mb-20 md:mb-24 text-center" style={{letterSpacing: '0.15em'}}>
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/gallery/${category.id}`}
                className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {covers[category.id] ? (
                    isVideoFile(covers[category.id]) ? (
                      <video
                        src={covers[category.id]}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        muted
                        loop
                        playsInline
                      />
                    ) : getEmbedUrl(covers[category.id]) ? (
                      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                        <PlayCircle className="w-16 h-16 text-white/80" />
                      </div>
                    ) : (
                      <img
                        src={covers[category.id]}
                        alt={category.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-2">
                        <PlayCircle className="w-6 h-6 text-white" />
                        <h3 className="font-display text-lg md:text-xl font-light uppercase tracking-wide text-white" style={{letterSpacing: '0.1em'}}>
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 md:py-40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-light uppercase tracking-wider mb-20 md:mb-24 text-center" style={{letterSpacing: '0.15em'}}>
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {[
              {
                title: 'Corporate Events',
                description: 'Professional coverage of conferences, seminars, and corporate gatherings',
                icon: Film,
              },
              {
                title: 'Concert Coverage',
                description: 'Dynamic filming of live music performances and entertainment events',
                icon: Video,
              },
              {
                title: 'Commercial Production',
                description: 'High-quality video production for brands and businesses',
                icon: Play,
              },
              {
                title: 'Event Highlights',
                description: 'Cinematic highlight reels capturing the essence of your event',
                icon: PlayCircle,
              },
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-light uppercase tracking-wide mb-4" style={{letterSpacing: '0.1em'}}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed" style={{letterSpacing: '0.02em'}}>
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
