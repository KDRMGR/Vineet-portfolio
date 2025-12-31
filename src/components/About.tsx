import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function About() {
  const navigate = useNavigate();
  const [heading, setHeading] = useState('What I Do');
  const [paragraph1, setParagraph1] = useState(
    'I am a storytelling geek based in Mumbai. The course of my journey has led me to discover my ability to capture moments and create enticing visuals out of them because the power of a sharp eye met with handling a camera well ascertains me to be able to tell a powerful story.'
  );
  const [paragraph2, setParagraph2] = useState('');
  const [imageUrl, setImageUrl] = useState('/ref/WhatsApp%20Image%202025-12-27%20at%208.08.25%20PM.jpeg');

  useEffect(() => {
    const load = async () => {
      const { data: aboutContent } = await supabase
        .from('content')
        .select('key,value')
        .eq('section', 'about')
        .in('key', ['heading', 'paragraph1', 'paragraph2']);

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
        .limit(1);

      if (aboutImage?.[0]?.image_url) setImageUrl(aboutImage[0].image_url);
    };

    load();
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
            <div className="w-64 h-80 md:w-72 md:h-96 lg:w-80 lg:h-[28rem] relative">
              <img
                src={imageUrl}
                alt="Photographer"
                className="w-full h-full object-cover rounded-lg opacity-90 transition-transform duration-700 hover:scale-105"
              />
              {/* Subtle decorative element */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
