import { useEffect, useState } from 'react';
import { subscribeToCmsUpdates, supabase } from '../lib/supabase';
import { Camera, Aperture, Heart, PlayCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultPhotographyCategories = [
  {
    name: 'Fashion & Lifestyle',
    slug: 'fashion',
    icon: Camera,
    description: 'Editorial shoots and lifestyle photography'
  },
  {
    name: 'People & Places',
    slug: 'people',
    icon: Aperture,
    description: 'Portrait and location photography'
  },
  {
    name: 'Concerts',
    slug: 'concerts',
    icon: Camera,
    description: 'Live music and performance photography'
  },
  {
    name: 'Corporate Events',
    slug: 'corporate',
    icon: Aperture,
    description: 'Professional corporate photography'
  },
  {
    name: 'Nightlife',
    slug: 'nightlife',
    icon: Camera,
    description: 'Night scene and club photography'
  },
  {
    name: 'Wedding & Others',
    slug: 'wedding',
    icon: Heart,
    description: 'Wedding photography and special occasions'
  }
];

interface GalleryImage {
  id: string;
  category: string;
  image_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
}

export default function PhotographyPage() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heading, setHeading] = useState('Photography');
  const [subheading, setSubheading] = useState('Capturing Moments in Time');
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState(defaultPhotographyCategories);
  const [activeCategory, setActiveCategory] = useState<{ slug: string; name: string } | null>(null);
  const [categoryImages, setCategoryImages] = useState<GalleryImage[]>([]);
  const [loadingCategoryImages, setLoadingCategoryImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

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

  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(url);

  useEffect(() => {
    let active = true;

    const fetchHeroImage = async () => {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('category', 'hero-photography')
        .order('order_index', { ascending: true })
        .limit(1);

      if (!active) return;
      if (!error && data?.[0]?.image_url) {
        setHeroImage(data[0].image_url);
      }
    };

    const fetchPageContent = async () => {
      const { data } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'photography')
        .in('key', ['heading', 'subheading', 'categories']);

      if (!active) return;
      let nextCategories = defaultPhotographyCategories;
      for (const row of data || []) {
        if (row.key === 'heading') setHeading(row.value);
        if (row.key === 'subheading') setSubheading(row.value);
        if (row.key === 'categories') {
          const parsed = safeParseCategoryList(row.value);
          if (parsed) {
            const metaBySlug = new Map(defaultPhotographyCategories.map((c) => [c.slug, c]));
            nextCategories = parsed.map((c) => {
              const meta = metaBySlug.get(c.id);
              return {
                name: c.name,
                slug: c.id,
                icon: meta?.icon || Camera,
                description: meta?.description || '',
              };
            });
          }
        }
      }
      setCategories(nextCategories);
      return nextCategories;
    };

    const fetchCovers = async (cats: typeof defaultPhotographyCategories) => {
      const ids = cats.map((c) => c.slug);
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
      const cats = (await fetchPageContent()) || defaultPhotographyCategories;
      await Promise.all([fetchHeroImage(), fetchCovers(cats)]);
    };

    load();
    const unsubscribe = subscribeToCmsUpdates(() => load());
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const slug = activeCategory?.slug;
    if (!slug) return;

    const load = async () => {
      setLoadingCategoryImages(true);
      const { data } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('category', slug)
        .order('order_index', { ascending: true });
      if (!active) return;
      setCategoryImages((data as GalleryImage[]) || []);
      setLoadingCategoryImages(false);
    };

    load();
    return () => {
      active = false;
    };
  }, [activeCategory?.slug]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Video/Image */}
      <section className="relative min-h-screen flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden">
        {/* Background Video/Image */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            {heroImage.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-30"
              >
                <source src={heroImage} type="video/mp4" />
              </video>
            ) : (
              <img
                src={heroImage}
                alt="Photography Hero"
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center">
          <div className="mb-12">
            <Camera className="w-24 h-24 mx-auto mb-8 text-white" />
          </div>
          <h1 className="font-display text-6xl md:text-9xl font-light uppercase tracking-[0.15em] mb-8" style={{letterSpacing: '0.15em'}}>
            {heading}
          </h1>
          <p className="font-sans text-2xl md:text-3xl uppercase tracking-[0.25em] mb-12 text-gray-400" style={{letterSpacing: '0.25em'}}>
            {subheading}
          </p>

          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-justify mb-6" style={{letterSpacing: '0.02em', lineHeight: '1.8'}}>
              Professional photography services for events, corporate functions, and commercial
              projects. With years of experience and an eye for detail, I create compelling visual
              narratives that tell your story.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify" style={{letterSpacing: '0.02em', lineHeight: '1.8'}}>
              From intimate portraits to large-scale events, every photograph is crafted with
              precision and artistic vision, delivering images that resonate and inspire.
            </p>
          </div>
        </div>

        {/* Play Button for Hero Video */}
        {heroImage && heroImage.match(/\.(mp4|webm|ogg)$/i) && (
          <button
            onClick={() => window.open(heroImage, '_blank')}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all group"
          >
            <PlayCircle className="w-8 h-8 text-white group-hover:text-gray-200" />
          </button>
        )}
      </section>

      {/* Gallery Categories */}
      <section className="py-32 md:py-40 px-4 md:px-8 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-6xl font-light uppercase tracking-wider mb-8 text-center" style={{letterSpacing: '0.15em'}}>
            Explore Categories
          </h2>
          <p className="font-sans text-center text-sm md:text-base uppercase tracking-wider text-gray-400 mb-20 md:mb-24" style={{letterSpacing: '0.2em'}}>
            Click on respective categories to navigate
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(null);
                    setActiveCategory({ slug: category.slug, name: category.name });
                  }}
                  className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105"
                  type="button"
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
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-32 md:py-40 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-wider mb-20 md:mb-24 text-center" style={{letterSpacing: '0.15em'}}>
            My Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
            {[
              { step: '01', title: 'Consultation', desc: 'Understanding your vision and requirements' },
              { step: '02', title: 'Planning', desc: 'Detailed shoot planning and preparation' },
              { step: '03', title: 'Shooting', desc: 'Professional photography session' },
              { step: '04', title: 'Delivery', desc: 'Edited high-quality images delivered' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="font-display text-5xl font-light text-gray-500 mb-6" style={{letterSpacing: '0.05em'}}>{item.step}</div>
                <h3 className="font-display text-lg md:text-xl font-light uppercase tracking-wide mb-4" style={{letterSpacing: '0.1em'}}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed" style={{letterSpacing: '0.02em'}}>
                  {item.desc}
                </p>
              </div>
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
                title: 'Event Photography',
                description: 'Comprehensive coverage of corporate events, conferences, and celebrations',
                icon: Camera,
              },
              {
                title: 'Portrait Sessions',
                description: 'Professional headshots, lifestyle portraits, and personal branding',
                icon: Aperture,
              },
              {
                title: 'Commercial Work',
                description: 'Product photography, brand imagery, and marketing materials',
                icon: Camera,
              },
              {
                title: 'Wedding Photography',
                description: 'Capturing the magic and emotion of your special day',
                icon: Heart,
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

      {/* CTA Section */}
      <section className="py-32 md:py-40 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-wider mb-8" style={{letterSpacing: '0.15em'}}>
            Ready to Create Something Amazing?
          </h2>
          <p className="font-sans text-xl text-gray-400 mb-12" style={{letterSpacing: '0.02em'}}>
            Let's bring your vision to life through professional photography
          </p>
          <Link
            to="/contact"
            className="inline-block px-12 py-5 bg-white text-black font-light uppercase tracking-wider text-sm hover:bg-gray-200 transition-all"
            style={{letterSpacing: '0.1em'}}
          >
            Get In Touch
          </Link>
        </div>
      </section>

      {activeCategory && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => {
            setActiveCategory(null);
            setSelectedImage(null);
            setCategoryImages([]);
          }}
        >
          <div
            className="w-full max-w-6xl pt-10 pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="text-2xl md:text-4xl font-display font-light uppercase tracking-wider">
                {activeCategory.name}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/gallery/${activeCategory.slug}`}
                  className="px-4 py-2 border-2 border-gray-600 text-gray-300 uppercase tracking-wider text-xs hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all"
                >
                  Open Page
                </Link>
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setSelectedImage(null);
                    setCategoryImages([]);
                  }}
                  className="p-3 border-2 border-gray-600 text-gray-300 hover:border-[#ff8c42] hover:text-[#ff8c42] transition-all"
                  aria-label="Close"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingCategoryImages ? (
              <div className="text-center py-20 text-gray-400 uppercase tracking-wider">
                Loading...
              </div>
            ) : categoryImages.length === 0 ? (
              <div className="text-center py-20 text-gray-500 uppercase tracking-wider">
                No media in this category yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className="border-2 border-gray-800 bg-black overflow-hidden group"
                    type="button"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-900">
                      {isVideoFile(img.image_url) ? (
                        <video
                          src={img.image_url}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={img.image_url}
                          alt={img.title || activeCategory.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-8 right-8 text-white hover:text-[#ff8c42] transition-colors"
                onClick={() => setSelectedImage(null)}
                type="button"
                aria-label="Close preview"
              >
                <X className="w-10 h-10" />
              </button>
              <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
                {isVideoFile(selectedImage.image_url) ? (
                  <video
                    src={selectedImage.image_url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                ) : (
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title || activeCategory.name}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                )}
                {(selectedImage.title || selectedImage.description) && (
                  <div className="mt-6 text-center">
                    {selectedImage.title && (
                      <h3 className="text-3xl font-bold uppercase tracking-wider mb-2 text-[#ff8c42]">
                        {selectedImage.title}
                      </h3>
                    )}
                    {selectedImage.description && (
                      <p className="text-lg text-gray-300">{selectedImage.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
