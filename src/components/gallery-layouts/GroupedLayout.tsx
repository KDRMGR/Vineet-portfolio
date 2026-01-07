import { PlayCircle } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

interface GroupedLayoutProps {
  groups: Array<{
    id: string;
    title: string | null;
    images: GalleryImage[];
    startIndex: number;
  }>;
  onImageClick: (index: number) => void;
}

export default function GroupedLayout({ groups, onImageClick }: GroupedLayoutProps) {
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
    <div className="space-y-12 md:space-y-16">
      {groups.map((group) => (
        <div key={group.id} id={group.id} className="space-y-6 scroll-mt-28">
          {group.title && (
            <div className="border-l-4 border-[#ff8c42] pl-4">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {group.title}
              </h3>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {group.images.map((image, imageIndex) => {
              const globalIndex = group.startIndex + imageIndex;
              const showTitle = Boolean(image.title);
              return (
                <div
                  key={image.id}
                  onClick={() => onImageClick(globalIndex)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-gray-900"
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
                      alt={image.title || `Gallery image ${globalIndex + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {(image.title || image.description) && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center p-6">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {showTitle && (
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
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
