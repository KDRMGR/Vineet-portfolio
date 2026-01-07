import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { subscribeToCmsUpdates, supabase, LayoutType } from '../lib/supabase';
import { ArrowLeft, PlayCircle, X } from 'lucide-react';
import GridLayout from '../components/gallery-layouts/GridLayout';
import MasonryLayout from '../components/gallery-layouts/MasonryLayout';
import CollageLayout from '../components/gallery-layouts/CollageLayout';
import GroupedLayout from '../components/gallery-layouts/GroupedLayout';

interface GalleryImage {
  id: string;
  category: string;
  image_url: string;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  section_id: string | null;
  order_index: number;
}

interface GallerySection {
  id: string;
  category: string;
  name: string;
  order_index: number;
}

const categoryTitles: Record<string, string> = {
  fashion: 'Fashion & Lifestyle',
  concerts: 'Concerts',
  corporate: 'Corporate Events',
  people: 'People & Places',
  nightlife: 'Nightlife',
  wedding: "Wedding & Others",
  'cinematography-highlight-reels': 'Highlight Reels',
  'cinematography-wedding-social-media': 'Wedding Social Media',
  'cinematography-short-films': 'Short Films',
  'cinematography-social-media-event-decor': 'Social Media Event Decor',
  'cinematography-tata-marathon': 'Tata Marathon',
  'cinematography-starbucks': 'Starbucks',
  'cinematography-others': 'Others',
  commercial: 'Commercial',
  events: 'Events',
  documentary: 'Documentary',
  live: 'Live Shows',
};

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');

  const stripQuery = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url.split('?')[0] || url;
    }
  };

  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(stripQuery(url));

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
      return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
    const vimeoId = getVimeoVideoId(url);
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
    const ig = getInstagramEmbedUrl(url);
    if (ig) return ig;
    return null;
  };

  const isEmbeddableUrl = (url: string) => Boolean(getEmbedUrl(url));

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'group';

  const groupedData = (() => {
    if (layoutType !== 'grouped') return null;

    const groups: Array<{
      id: string;
      title: string | null;
      images: GalleryImage[];
      startIndex: number;
    }> = [];

    if (sections.length > 0) {
      let startIndex = 0;
      for (const section of sections) {
        const sectionImages = images.filter((img) => img.section_id === section.id);
        if (sectionImages.length === 0) continue;
        const id = `${slugify(section.name)}-${section.id.slice(0, 8)}`;
        groups.push({
          id,
          title: section.name,
          images: sectionImages,
          startIndex,
        });
        startIndex += sectionImages.length;
      }

      const unsectioned = images.filter((img) => !img.section_id);
      if (unsectioned.length > 0) {
        groups.push({ id: 'media', title: null, images: unsectioned, startIndex });
      }

      const orderedImages = groups.flatMap((g) => g.images);
      return { groups, orderedImages };
    }

    const byKey = new Map<string, Omit<(typeof groups)[number], 'startIndex'>>();
    const orderedKeys: string[] = [];
    const idCounts = new Map<string, number>();

    const getNextId = (label: string) => {
      const base = slugify(label);
      const nextCount = (idCounts.get(base) || 0) + 1;
      idCounts.set(base, nextCount);
      return nextCount === 1 ? base : `${base}-${nextCount}`;
    };

    for (const img of images) {
      const firstTag = img.tags?.[0]?.trim() || '';
      const key = firstTag ? `tag:${firstTag.toLowerCase()}` : 'untagged';
      let group = byKey.get(key);
      if (!group) {
        group = {
          id: firstTag ? getNextId(firstTag) : 'media',
          title: firstTag ? firstTag : null,
          images: [],
        };
        byKey.set(key, group);
        orderedKeys.push(key);
      }
      group.images.push(img);
    }

    let startIndex = 0;
    for (const key of orderedKeys) {
      const g = byKey.get(key);
      if (!g) continue;
      groups.push({ ...g, startIndex });
      startIndex += g.images.length;
    }

    const orderedImages = groups.flatMap((g) => g.images);
    return { groups, orderedImages };
  })();

  useEffect(() => {
    if (layoutType !== 'grouped') return;
    if (!groupedData?.groups.length) return;
    const hash = location.hash ? location.hash.replace(/^#/, '') : '';
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [layoutType, groupedData?.groups.length, location.hash]);

  useEffect(() => {
    fetchImages();
    fetchLayout();
    fetchSections();
  }, [category]);

  useEffect(() => {
    if (!category) return;
    const unsubscribe = subscribeToCmsUpdates(() => {
      fetchImages();
      fetchLayout();
      fetchSections();
    });
    return () => unsubscribe();
  }, [category]);

  const fetchImages = async () => {
    if (!category) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const fetchSections = async () => {
    if (!category) return;
    const { data, error } = await supabase
      .from('gallery_sections')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true });
    if (error) {
      setSections([]);
      return;
    }
    setSections(data || []);
  };

  const fetchLayout = async () => {
    if (!category) return;

    const { data, error } = await supabase
      .from('gallery_settings')
      .select('layout_type')
      .eq('category', category)
      .single();

    if (!error && data) {
      setLayoutType(data.layout_type as LayoutType);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleImageClick = (index: number) => {
    const list = layoutType === 'grouped' ? groupedData?.orderedImages || [] : images;
    setSelectedImage(list[index]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#ff8c42] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="uppercase tracking-wider">Back to Home</span>
        </button>

        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-16 text-center">
          {categoryTitles[category || ''] || category}
        </h1>

        {layoutType === 'grouped' && groupedData?.groups.some((g) => g.title) && (
          <div className="mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedData.groups
                .filter((g) => g.title)
                .map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(g.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      const nextHash = `#${g.id}`;
                      if (location.hash !== nextHash) {
                        window.history.replaceState(null, '', `${location.pathname}${location.search}${nextHash}`);
                      }
                    }}
                    className="group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 border-2 border-gray-800"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
                      {g.images[0]?.image_url ? (
                        isVideoFile(g.images[0].image_url) ? (
                          <video
                            src={g.images[0].image_url}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            muted
                            loop
                            playsInline
                            autoPlay
                            preload="metadata"
                          />
                        ) : isEmbeddableUrl(g.images[0].image_url) ? (
                          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center transition-all duration-700 group-hover:scale-110">
                            <PlayCircle className="w-16 h-16 text-white/80" />
                          </div>
                        ) : (
                          <img
                            src={g.images[0].image_url}
                            alt={g.title || ''}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-6 h-6 text-white" />
                          <span className="font-display text-lg font-light uppercase tracking-wide text-white">
                            {g.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {layoutType === 'grid' && <GridLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'masonry' && <MasonryLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'collage' && <CollageLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'grouped' && groupedData && (
          <GroupedLayout groups={groupedData.groups} onImageClick={handleImageClick} />
        )}

        {images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 uppercase tracking-wider">
              No images in this gallery yet
            </p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white hover:text-[#ff8c42] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
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
            ) : getEmbedUrl(selectedImage.image_url) ? (
              <div className="w-full aspect-video max-h-[85vh]">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(selectedImage.image_url) || undefined}
                  title={selectedImage.title || 'Embedded media'}
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{ border: 'none' }}
                />
              </div>
            ) : (
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || ''}
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
  );
}
