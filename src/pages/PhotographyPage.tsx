import { Link } from 'react-router-dom';
import { Camera, Palette, Users, Music, Building, Moon } from 'lucide-react';

const photographyCategories = [
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    icon: Palette,
    description: 'Editorial shoots, fashion photography, and lifestyle imagery',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop',
  },
  {
    name: 'People & Places',
    slug: 'people',
    icon: Users,
    description: 'Portrait photography and stunning location shoots',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=600&fit=crop',
  },
  {
    name: 'Concerts',
    slug: 'concerts',
    icon: Music,
    description: 'Live music events and performance photography',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=600&fit=crop',
  },
  {
    name: 'Corporate Events',
    slug: 'corporate',
    icon: Building,
    description: 'Professional corporate and business event coverage',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
  },
  {
    name: 'Nightlife',
    slug: 'nightlife',
    icon: Moon,
    description: 'Night scene photography and club event coverage',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
  },
];

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <Camera className="w-24 h-24 mx-auto mb-8 text-[#ff8c42]" />
          </div>
          <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-[0.3em] mb-8">
            Photography
          </h1>
          <p className="text-2xl md:text-3xl uppercase tracking-[0.4em] mb-12 text-gray-400">
            Capturing Moments That Matter
          </p>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-justify mb-6">
              As a visual storyteller, I specialize in capturing moments that matter. From fashion
              editorials to concert photography, corporate events to intimate portraits, I create
              visual narratives that resonate with audiences.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              My work combines technical expertise with artistic vision, ensuring every project
              tells a unique and compelling story. Each photograph is crafted with precision and
              creativity, delivering images that stand the test of time.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-16 text-center">
            Photography Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Event Photography',
                description:
                  'Comprehensive coverage of corporate events, conferences, and special occasions',
              },
              {
                title: 'Portrait Photography',
                description: 'Professional portraits for individuals, families, and corporate headshots',
              },
              {
                title: 'Commercial Photography',
                description: 'Product photography, brand campaigns, and commercial shoots',
              },
            ].map((service, index) => (
              <div
                key={index}
                className="border-2 border-[#ff8c42] p-8 text-center hover:bg-[#ff8c42]/10 transition-all"
              >
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-4 text-[#ff8c42]">
                  {service.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Categories */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-8 text-center">
            Explore Categories
          </h2>
          <p className="text-xl uppercase tracking-[0.2em] text-gray-400 text-center mb-16">
            Click on respective categories to navigate
          </p>

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
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
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-16 text-center">
            My Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Consultation', desc: 'Understanding your vision and requirements' },
              { step: '02', title: 'Planning', desc: 'Detailed shoot planning and preparation' },
              { step: '03', title: 'Shooting', desc: 'Professional photography session' },
              { step: '04', title: 'Delivery', desc: 'Edited high-quality images delivered' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-[#ff8c42] mb-4">{item.step}</div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-8">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Let's bring your vision to life through professional photography
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-[#ff8c42] text-black font-bold uppercase tracking-wider text-lg hover:bg-white transition-all"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
