import { PlayCircle } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

interface GridLayoutProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export default function GridLayout({ images, onImageClick }: GridLayoutProps) {
  const stripQuery = (url: string) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url.split('?')[0] || url;
    }
  };

  const isVideoFile = (url: string) => /\.(mp4|webm|ogg)$/i.test(stripQuery(url));

  const isEmbeddableUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '');
      if (host === 'youtu.be' || host.endsWith('youtube.com')) return true;
      if (host.endsWith('vimeo.com')) return true;
      if (host.endsWith('instagram.com')) return true;
    } catch {
      return false;
    }
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {images.map((image, index) => (
        <div
          key={image.id}
          onClick={() => onImageClick(index)}
          className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-900"
        >
          {isVideoFile(image.image_url) ? (
            <video
              src={image.image_url}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
          ) : isEmbeddableUrl(image.image_url) ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
              <PlayCircle className="w-16 h-16 text-white/70" />
            </div>
          ) : (
            <img
              src={image.image_url}
              alt={image.title || `Gallery image ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {(image.title || image.description) && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center p-6">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.title && (
                  <h3 className="text-lg font-display uppercase tracking-wider mb-2">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-sm text-gray-300">{image.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
