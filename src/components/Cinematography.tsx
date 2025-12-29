import { Video, Film, Clapperboard } from 'lucide-react';

const cinematographyProjects = [
  {
    title: 'Corporate Events',
    description: 'Professional coverage of corporate conferences and seminars',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    category: 'corporate'
  },
  {
    title: 'Concert Coverage',
    description: 'Live music events and performance documentation',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    category: 'music'
  },
  {
    title: 'Commercial Production',
    description: 'High-quality commercial video production',
    image: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&h=600&fit=crop',
    category: 'commercial'
  },
  {
    title: 'Event Highlights',
    description: 'Capturing the essence of special moments',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
    category: 'events'
  },
  {
    title: 'Documentary Style',
    description: 'Authentic storytelling through cinematic visuals',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=600&fit=crop',
    category: 'documentary'
  },
  {
    title: 'Live Shows',
    description: 'Dynamic coverage of live performances and shows',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    category: 'live'
  }
];

export default function Cinematography() {
  return (
    <section id="cinematography" className="min-h-screen bg-black text-white py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-8">
            Cinematography
          </h2>
          <p className="text-xl uppercase tracking-[0.2em] text-gray-400">
            Click on respective categories to navigate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {cinematographyProjects.map((project, index) => (
            <div
              key={index}
              className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Video className="w-16 h-16 text-[#ff8c42]" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-2 group-hover:text-[#ff8c42] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 tracking-wide">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8 mt-16">
          <div className="flex items-center gap-4">
            <Film className="w-12 h-12 text-[#ff8c42]" />
            <span className="text-xl uppercase tracking-wider">Professional Equipment</span>
          </div>
          <div className="flex items-center gap-4">
            <Clapperboard className="w-12 h-12 text-[#ff8c42]" />
            <span className="text-xl uppercase tracking-wider">4K Production</span>
          </div>
        </div>
      </div>
    </section>
  );
}
