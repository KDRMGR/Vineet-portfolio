import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToCmsUpdates, supabase } from '../lib/supabase';

export default function About() {
  const navigate = useNavigate();
  const [heading, setHeading] = useState('What I Do');
  const [paragraph1, setParagraph1] = useState(
    'I am a storytelling geek based in Mumbai. The course of my journey has led me to discover my ability to capture moments and create enticing visuals out of them because the power of a sharp eye met with handling a camera well ascertains me to be able to tell a powerful story.'
  );
  const [paragraph2, setParagraph2] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data: aboutContent } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'about')
        .in('key', ['heading', 'paragraph1', 'paragraph2']);

      if (!active) return;
      for (const row of aboutContent || []) {
        if (row.key === 'heading') setHeading(row.value);
        if (row.key === 'paragraph1') setParagraph1(row.value);
        if (row.key === 'paragraph2') setParagraph2(row.value);
      }

      const { data: aboutImage } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('category', 'about-image')
        .order('order_index', { ascending: true })
        .limit(3);

      if (!active) return;
      setImageUrls((aboutImage || []).map((row) => row.image_url).filter(Boolean));
    };

    load();
    const unsubscribe = subscribeToCmsUpdates(() => load());
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <section id="about" className="min-h-screen bg-black text-white py-40 md:py-48 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">
          {/* Text Content */}
          <div className="space-y-10 max-w-lg">
            <h2 className="font-display text-4xl md:text-5xl font-light uppercase tracking-wider mb-10 animate-fadeIn text-white" style={{letterSpacing: '0.15em'}}>
              {heading}
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-justify animate-slideUp text-gray-300" style={{letterSpacing: '0.02em', lineHeight: '1.8'}}>
              {paragraph1}{paragraph2 ? ` ${paragraph2}` : ''}
            </p>

            {/* Action Buttons */}
            <div className="space-y-6 pt-10 animate-slideInLeft">
              <button
                onClick={() => navigate('/photography')}
                className="flex items-center gap-3 text-sm font-light uppercase tracking-wider text-white hover:text-gray-300 transition-colors group"
                style={{letterSpacing: '0.1em'}}
              >
                <span>VIEW MY WORK</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={() => navigate('/about')}
                className="flex items-center gap-3 text-sm font-light uppercase tracking-wider text-white hover:text-gray-300 transition-colors group"
                style={{letterSpacing: '0.1em'}}
              >
                <span>KNOW MORE</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end animate-slideInRight">
            <div className="w-72 h-[26rem] md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem] relative">
              {imageUrls.length > 0 ? (
                <>
                  <img
                    src={imageUrls[0]}
                    alt="About"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[78%] h-[72%] object-cover rounded-lg opacity-90 shadow-2xl border border-white/10"
                  />
                  {imageUrls[1] && (
                    <img
                      src={imageUrls[1]}
                      alt="About"
                      className="absolute bottom-2 left-0 w-[56%] h-[54%] object-cover rounded-lg opacity-95 shadow-2xl border border-white/10 -rotate-6"
                    />
                  )}
                  {imageUrls[2] && (
                    <img
                      src={imageUrls[2]}
                      alt="About"
                      className="absolute bottom-0 right-0 w-[56%] h-[54%] object-cover rounded-lg opacity-95 shadow-2xl border border-white/10 rotate-6"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-b from-gray-900 to-black" />
              )}
              {/* Subtle decorative element */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
