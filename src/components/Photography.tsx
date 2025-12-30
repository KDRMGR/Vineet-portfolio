import { Users, Music, Building, Moon, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const photographyCategories = [
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    icon: Palette,
    description: 'Editorial shoots and lifestyle photography',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop'
  },
  {
    name: 'People & Places',
    slug: 'people',
    icon: Users,
    description: 'Portrait and location photography',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop'
  },
  {
    name: 'Concerts',
    slug: 'concerts',
    icon: Music,
    description: 'Live music and performance photography',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop'
  },
  {
    name: 'Corporate Events',
    slug: 'corporate',
    icon: Building,
    description: 'Professional corporate photography',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop'
  },
  {
    name: 'Nightlife',
    slug: 'nightlife',
    icon: Moon,
    description: 'Night scene and club photography',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop'
  }
];

export default function Photography() {
  return (
    <section id="photography" className="min-h-screen bg-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold uppercase tracking-wider mb-3 sm:mb-4 text-white animate-fadeIn" style={{letterSpacing: '0.15em'}}>
            MY PROJECTS
          </h2>
          <p className="text-center text-xs sm:text-sm md:text-base uppercase tracking-wider text-gray-400 animate-slideUp px-4" style={{letterSpacing: '0.2em'}}>
            Click on respective categories to navigate
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {photographyCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/gallery/${category.slug}`}
                className="group relative overflow-hidden cursor-pointer transition-all duration-300 rounded-sm"
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-sm">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                        <h3 className="font-display text-sm sm:text-base md:text-lg font-medium uppercase tracking-wide text-white" style={{letterSpacing: '0.1em'}}>
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{letterSpacing: '0.05em'}}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}