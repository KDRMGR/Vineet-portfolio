export default function About() {
  return (
    <section id="about" className="min-h-screen bg-white text-black py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-4 sm:space-y-6 max-w-lg">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-wider mb-3 sm:mb-4 animate-fadeIn" style={{letterSpacing: '0.15em'}}>
              WHAT I DO
            </h2>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-justify animate-slideUp" style={{letterSpacing: '0.02em'}}>
              I am a storytelling geek based in Mumbai. The course of my journey has led me to discover my ability to capture moments and create enticing visuals out of them because the power of a sharp eye met with handling a camera well ascertains me to be able to tell a powerful story.
            </p>

            {/* Action Buttons */}
            <div className="space-y-2.5 sm:space-y-3 pt-3 sm:pt-4 animate-slideInLeft">
              <button className="flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-black hover:text-yellow-600 transition-colors group" style={{letterSpacing: '0.1em'}}>
                <span>VIEW MY WORK</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yellow-600 flex items-center justify-center group-hover:bg-yellow-700 transition-colors flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-black hover:text-yellow-600 transition-colors group" style={{letterSpacing: '0.1em'}}>
                <span>KNOW MORE</span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yellow-600 flex items-center justify-center group-hover:bg-yellow-700 transition-colors flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative flex justify-center lg:justify-end animate-slideInRight mt-8 lg:mt-0">
            <div className="w-48 h-64 xs:w-56 xs:h-72 sm:w-64 sm:h-80 md:w-72 md:h-96 relative">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=800&fit=crop"
                alt="Photographer"
                className="w-full h-full object-cover rounded-lg opacity-90 transition-transform duration-700 hover:scale-105"
              />
              {/* Decorative blur effect */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-purple-300 rounded-full blur-2xl opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}