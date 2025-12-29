import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Video, Film, Play } from 'lucide-react';

interface VideoProject {
  id: string;
  category: string;
  image_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
}

export default function CinematographyPage() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    // Fetch from all cinematography-related categories
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .in('category', ['concerts', 'corporate'])
      .order('order_index', { ascending: true });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
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
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <Video className="w-24 h-24 mx-auto mb-8 text-[#ff8c42]" />
          </div>
          <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-[0.3em] mb-8">
            Cinematography
          </h1>
          <p className="text-2xl md:text-3xl uppercase tracking-[0.4em] mb-12 text-gray-400">
            Visual Storytelling Through Motion
          </p>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-justify mb-6">
              Creating dynamic visual narratives for corporate events, concerts, and commercial
              productions. Each project is crafted with precision, bringing stories to life through
              the lens with professional-grade equipment and 4K production quality.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              From live music events to corporate conferences, I specialize in capturing the energy
              and emotion of every moment, delivering polished, impactful videos that resonate with
              audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-16 text-center">
            Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                icon: Film,
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="border-2 border-gray-800 p-6 hover:border-[#ff8c42] transition-all group"
                >
                  <Icon className="w-12 h-12 text-[#ff8c42] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold uppercase tracking-wider mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-16 text-center">
            Recent Projects
          </h2>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    <img
                      src={project.image_url}
                      alt={project.title || ''}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-16 h-16 text-[#ff8c42]" />
                    </div>
                  </div>
                  {project.title && (
                    <div className="mt-4">
                      <h3 className="text-xl font-bold uppercase tracking-wider group-hover:text-[#ff8c42] transition-colors">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-400 mt-2">{project.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-700" />
              <p className="text-2xl text-gray-500 uppercase tracking-wider">
                Portfolio coming soon
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Equipment Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-12">
            Professional Equipment
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['4K Cameras', 'Gimbals', 'Drones', 'Lighting'].map((item) => (
              <div
                key={item}
                className="border-2 border-[#ff8c42] p-6 hover:bg-[#ff8c42]/10 transition-all"
              >
                <p className="text-lg font-bold uppercase tracking-wider">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
