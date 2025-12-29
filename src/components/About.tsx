export default function About() {
  return (
    <section id="about" className="min-h-screen bg-black text-white py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold uppercase tracking-[0.3em] mb-20 text-center">
          What I Do
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              I am a commercial event photographer and videographer with a strong foundation in mass media
              and hands-on experience across corporate events, conferences, concerts, and live shows. Each
              project adds productive, on-ground experience to my journey, cultivating dedication,
              precision, and professionalism while delivering visuals that meet industry standards.
            </p>
            <p className="text-lg md:text-xl leading-relaxed text-justify">
              The course of my journey has led me to discover my ability to capture moments and create
              enticing visuals. As a visual storyteller, I specialize in bringing stories to life through
              the lens, combining technical expertise with artistic vision.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-full overflow-hidden border-4 border-[#ff8c42] mx-auto max-w-md">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop"
                alt="Photographer with camera"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-[#ff8c42] p-8 text-center hover:bg-[#ff8c42]/10 transition-all">
            <h3 className="text-3xl font-bold uppercase tracking-wider mb-4 text-[#ff8c42]">
              Photography
            </h3>
            <p className="text-base leading-relaxed">
              Capturing stunning moments across events, portraits, and commercial shoots with
              precision and creativity.
            </p>
          </div>

          <div className="border-2 border-[#ff8c42] p-8 text-center hover:bg-[#ff8c42]/10 transition-all">
            <h3 className="text-3xl font-bold uppercase tracking-wider mb-4 text-[#ff8c42]">
              Cinematography
            </h3>
            <p className="text-base leading-relaxed">
              Creating dynamic visual narratives for corporate events, concerts, and commercial
              productions.
            </p>
          </div>

          <div className="border-2 border-[#ff8c42] p-8 text-center hover:bg-[#ff8c42]/10 transition-all">
            <h3 className="text-3xl font-bold uppercase tracking-wider mb-4 text-[#ff8c42]">
              Video Editing
            </h3>
            <p className="text-base leading-relaxed">
              Delivering polished, professional edits that bring your stories to life with impact
              and emotion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
