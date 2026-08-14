import { useState } from "react";

export default function ImageGallery({ images, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
    if (e.key === "Escape") onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-40 transition-opacity duration-300"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={handleKeyDown} tabIndex="0">
        
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-96 flex flex-col">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors duration-200"
          >
            ✕
          </button>

          <div className="flex-1 bg-gray-100 flex items-center justify-center overflow-hidden">
            <img
              src={currentImage}
              alt={`Imagen ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white hover:bg-gray-100 text-gray-800 rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-200 hover:shadow-lg"
                title="Imagen anterior (←)"
              >
                ◀
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 w-12 h-12 bg-white hover:bg-gray-100 text-gray-800 rounded-full flex items-center justify-center font-bold text-2xl transition-all duration-200 hover:shadow-lg"
                title="Siguiente imagen (→)"
              >
                ▶
              </button>
            </>
          )}

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            
            <div className="text-sm text-gray-600">
              {hasMultipleImages ? (
                <>
                  <span className="font-semibold">{currentImageIndex + 1}</span>
                  <span> / {images.length} imágenes</span>
                </>
              ) : (
                <span>Proyecto compartido por usuario</span>
              )}
            </div>

            {hasMultipleImages && (
              <div className="flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? "bg-blue-900 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    title={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}