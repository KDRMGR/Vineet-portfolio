import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToCmsUpdates, supabase, LayoutType } from '../lib/supabase';
import { ArrowLeft, X } from 'lucide-react';
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
  order_index: number;
}

const categoryTitles: Record<string, string> = {
  fashion: 'Fashion & Lifestyle',
  concerts: 'Concerts',
  corporate: 'Corporate Events',
  people: 'People & Places',
  nightlife: 'Nightlife',
  wedding: "Wedding & Others",
};

export default function GalleryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');

  useEffect(() => {
    fetchImages();
    fetchLayout();
  }, [category]);

  useEffect(() => {
    if (!category) return;
    const unsubscribe = subscribeToCmsUpdates(() => {
      fetchImages();
      fetchLayout();
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
    setSelectedImage(images[index]);
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

        {layoutType === 'grid' && <GridLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'masonry' && <MasonryLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'collage' && <CollageLayout images={images} onImageClick={handleImageClick} />}
        {layoutType === 'grouped' && <GroupedLayout images={images} onImageClick={handleImageClick} />}

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
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-10 h-10" />
          </button>
          <div className="max-w-6xl w-full">
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title || ''}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
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
