import { Users, Music, Building, Moon, Palette, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const photographyCategories = [
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    icon: Palette,
    description: 'Editorial shoots and lifestyle photography'
  },
  {
    name: 'People & Places',
    slug: 'people',
    icon: Users,
    description: 'Portrait and location photography'
  },
  {
    name: 'Concerts',
    slug: 'concerts',
    icon: Music,
    description: 'Live music and performance photography'
  },
  {
    name: 'Corporate Events',
    slug: 'corporate',
    icon: Building,
    description: 'Professional corporate photography'
  },
  {
    name: 'Nightlife',
    slug: 'nightlife',
    icon: Moon,
    description: 'Night scene and club photography'
  },
  {
    name: 'Wedding & Others',
    slug: 'wedding',
    icon: Heart,
    description: 'Wedding photography and special occasions'
  }
];

const categoryIds = photographyCategories.map((c) => c.slug);

export default function Photography() {
  const [covers, setCovers] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .in('category', categoryIds)
        .order('order_index', { ascending: true });

      const next: Record<string, string> = {};
      for (const cat of categoryIds) {
        const first = (data || []).find((row) => row.category === cat);
        if (first?.image_url) next[cat] = first.image_url;
      }
      setCovers(next);
    };

    load();
  }, []);

  return (
    <section id="photography" className="min-h-screen bg-black text-white py-32 md:py-40 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-light uppercase tracking-wider mb-8 text-white animate-fadeIn" style={{letterSpacing: '0.15em'}}>
            MY PROJECTS
          </h2>
          <p className="text-center text-sm md:text-base uppercase tracking-wider text-gray-400 animate-slideUp" style={{letterSpacing: '0.2em'}}>
            Click on respective categories to navigate
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
          {photographyCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/gallery/${category.slug}`}
                className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {covers[category.slug] ? (
                    <img
                      src={covers[category.slug]}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="w-5 h-5 text-white" />
                        <h3 className="font-display text-lg md:text-xl font-light uppercase tracking-wide text-white" style={{letterSpacing: '0.1em'}}>
                          {category.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-light" style={{letterSpacing: '0.05em'}}>
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
