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
    <section id="photography" className="min-h-screen bg-background-white py-30 md:py-34 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-22 md:mb-26">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide mb-6 md:mb-8 text-primary">
            My Projects
          </h2>
          <p className="font-sans text-lg md:text-xl tracking-wide text-text-secondary font-light">
            Click on respective categories to navigate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {photographyCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/gallery/${category.slug}`}
                className="group relative overflow-hidden cursor-pointer transition-slow"
              >
                <div className="aspect-[4/3] relative overflow-hidden rounded-sm">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-slow group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-slow">
                      <IconComponent className="w-10 h-10 md:w-12 md:h-12 text-accent mb-4 transition-slow group-hover:text-accent-light" />
                      <h3 className="font-display text-xl md:text-2xl font-semibold tracking-wide text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="font-sans text-sm text-gray-200 tracking-wide opacity-0 group-hover:opacity-100 transition-slow">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-22 md:mt-26 text-center">
          <div className="inline-flex items-center gap-4 px-10 py-5">
            <Camera className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            <span className="font-display text-xl md:text-2xl font-semibold tracking-wide text-primary">
              Professional Photography Services
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
