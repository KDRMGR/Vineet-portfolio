export default function AboutPage() {
  const aboutImage = '/ref/about.JPEG';

  return (
    <section id="about" className="min-h-screen bg-black flex items-center justify-center py-20 md:py-32 px-6 md:px-10">
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
    </section>
  );
}