import { Camera, Users, Music, Building, Moon, Palette } from 'lucide-react';
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
    <section id="photography" className="min-h-screen bg-white text-black py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-8">
            My Projects
          </h2>
          <p className="text-xl uppercase tracking-[0.2em] text-gray-600">
            Click on respective categories to navigate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photographyCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/gallery/${category.slug}`}
                className="group relative overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300 group-hover:translate-y-0">
                      <IconComponent className="w-12 h-12 text-[#ff8c42] mb-4" />
                      <h3 className="text-2xl font-bold uppercase tracking-wider text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-300 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 border-2 border-black px-8 py-4">
            <Camera className="w-10 h-10" />
            <span className="text-2xl font-bold uppercase tracking-wider">
              Professional Photography Services
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
