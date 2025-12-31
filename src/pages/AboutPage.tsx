import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AboutPage() {
  const [aboutImage, setAboutImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('gallery_images')
          .select('image_url')
          .eq('category', 'about-image')
          .single();

        if (data?.image_url) {
          console.log('Using Supabase image:', data.image_url);
          setAboutImage(data.image_url);
        } else {
          // Fallback to ref folder image
          const fallbackImage = '/ref/about-image.jpg';
          console.log('Using fallback ref image:', fallbackImage);
          setAboutImage(fallbackImage);
        }
      } catch (error) {
        console.error('Error loading about image:', error);
        const fallbackImage = '/ref/about-image.jpg';
        setAboutImage(fallbackImage);
      }
    };
    load();
  }, []);

  return (
    <section id="about" className="min-h-screen bg-black flex items-center justify-center py-20 md:py-32 px-6 md:px-10">
      {aboutImage && (
        <div className="w-full max-w-6xl mx-auto">
          <img
            src={aboutImage}
            alt="About"
            className="w-full h-auto rounded-lg shadow-2xl"
            onError={(e) => {
              console.error('Image failed to load:', aboutImage);
              console.error('Image error:', e);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', aboutImage);
            }}
          />
        </div>
      )}
    </section>
  );
}