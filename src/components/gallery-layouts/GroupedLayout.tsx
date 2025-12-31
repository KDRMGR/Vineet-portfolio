interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

interface GroupedLayoutProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export default function GroupedLayout({ images, onImageClick }: GroupedLayoutProps) {
  // Group images in sets of 3-4
  const groupSize = 3;
  const groups: GalleryImage[][] = [];

  for (let i = 0; i < images.length; i += groupSize) {
    groups.push(images.slice(i, i + groupSize));
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-6">
          {/* Group Header if first image has title */}
          {group[0]?.title && (
            <div className="border-l-4 border-[#ff8c42] pl-4">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {group[0].title}
              </h3>
            </div>
          )}

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {group.map((image, imageIndex) => {
              const globalIndex = groupIndex * groupSize + imageIndex;
              return (
                <div
                  key={image.id}
                  onClick={() => onImageClick(globalIndex)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-gray-900"
                >
                  <img
                    src={image.image_url}
                    alt={image.title || `Gallery image ${globalIndex + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {(image.title || image.description) && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center p-6">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {image.title && imageIndex !== 0 && (
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
