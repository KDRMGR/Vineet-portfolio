import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Video, Film, Play, PlayCircle } from 'lucide-react';

interface VideoProject {
  id: string;
  category: string;
  image_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
  is_video?: boolean;
}

export default function CinematographyPage() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [heading, setHeading] = useState('Cinematography');
  const [subheading, setSubheading] = useState('Visual Storytelling Through Motion');

  useEffect(() => {
    fetchProjects();
    fetchHeroVideo();
    fetchPageContent();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .in('category', ['concerts', 'corporate', 'commercial', 'events', 'documentary', 'live'])
      .order('order_index', { ascending: true });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const fetchHeroVideo = async () => {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'hero-cinematography')
      .order('order_index', { ascending: true })
      .limit(1);

    if (!error && data?.[0]?.image_url) {
      setHeroVideo(data[0].image_url);
    }
  };

  const fetchPageContent = async () => {
    const { data } = await supabase
      .from('content')
      .select('key,value')
      .eq('section', 'cinematography')
      .in('key', ['heading', 'subheading']);

    for (const row of data || []) {
      if (row.key === 'heading') setHeading(row.value);
      if (row.key === 'subheading') setSubheading(row.value);
    }
  };

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
        {heroVideo && (
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-30"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <div className="mb-12">
            <Film className="w-24 h-24 mx-auto mb-8 text-white" />
          </div>
          <h1 className="font-display text-6xl md:text-9xl font-light uppercase tracking-[0.15em] mb-8" style={{letterSpacing: '0.15em'}}>
            {heading}
          </h1>
          <p className="font-sans text-2xl md:text-3xl uppercase tracking-[0.25em] mb-12 text-gray-400" style={{letterSpacing: '0.25em'}}>
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

        {/* Play Button for Hero Video */}
        {heroVideo && (
          <button
            onClick={() => setSelectedVideo(heroVideo)}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all group"
          >
            <PlayCircle className="w-8 h-8 text-white group-hover:text-gray-200" />
          </button>
        )}
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

      {/* Projects Grid */}
      <section className="py-32 md:py-40 px-4 md:px-8 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-light uppercase tracking-wider mb-20 md:mb-24 text-center" style={{letterSpacing: '0.15em'}}>
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedVideo(project.image_url)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {project.image_url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={project.image_url}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={project.image_url}
                      alt={project.title || 'Project'}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-2">
                        <PlayCircle className="w-6 h-6 text-white" />
                        <h3 className="font-display text-lg md:text-xl font-light uppercase tracking-wide text-white" style={{letterSpacing: '0.1em'}}>
                          {project.title || 'Untitled Project'}
                        </h3>
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-light" style={{letterSpacing: '0.05em'}}>
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              {selectedVideo.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={selectedVideo}
                  alt="Project"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}