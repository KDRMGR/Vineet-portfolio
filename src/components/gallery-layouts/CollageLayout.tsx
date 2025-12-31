interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

interface CollageLayoutProps {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}

export default function CollageLayout({ images, onImageClick }: CollageLayoutProps) {
  // Create groups of images with varying sizes for collage effect
  const getImageClass = (index: number) => {
    const pattern = index % 7;
    switch (pattern) {
      case 0:
        return 'col-span-2 row-span-2'; // Large
      case 1:
      case 2:
        return 'col-span-1 row-span-1'; // Small
      case 3:
        return 'col-span-2 row-span-1'; // Wide
      case 4:
        return 'col-span-1 row-span-2'; // Tall
      case 5:
      case 6:
        return 'col-span-1 row-span-1'; // Small
      default:
        return 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 md:gap-6">
      {images.map((image, index) => (
        <div
          key={image.id}
          onClick={() => onImageClick(index)}
          className={`group relative overflow-hidden rounded-lg cursor-pointer bg-gray-900 ${getImageClass(
            index
          )}`}
        >
          <img
            src={image.image_url}
            alt={image.title || `Gallery image ${index + 1}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
