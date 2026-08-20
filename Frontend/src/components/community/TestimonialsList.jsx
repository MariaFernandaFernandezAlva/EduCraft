import { useState } from "react";
import ImageGallery from "../common/ImageGallery";

export default function TestimonialsList({ testimonials }) {
  const [galleryState, setGalleryState] = useState({
    isOpen: false,
    images: [],
  });

  const openGallery = (images) => {
    if (images && images.length > 0) {
      setGalleryState({
        isOpen: true,
        images: images,
      });
    }
  };

  const closeGallery = () => {
    setGalleryState({ isOpen: false, images: [] });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < rating ? "text-amber-400 text-lg" : "text-gray-300 text-lg"
        }
      >
        ★
      </span>
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {renderStars(testimonial.rating)}
            </div>

            {/* Comment */}
            <p className="text-gray-700 leading-relaxed mb-6 italic">
              "{testimonial.comment}"
            </p>

            {/* User Info and Gallery Button */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-900 to-teal-600 text-white flex items-center justify-center font-bold text-sm">
                  {testimonial.avatar}
                </div>

                {/* Name and Role */}
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(testimonial.date)}
                  </p>
                </div>
              </div>

              {/* Gallery Button - Only show if testimonial has images */}
              {testimonial.images && testimonial.images.length > 0 && (
                <button
                  onClick={() => openGallery(testimonial.images)}
                  className="shrink-0 px-3 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors duration-200 whitespace-nowrap"
                  title={`Ver ${testimonial.images.length} imagen${testimonial.images.length !== 1 ? 'es' : ''}`}
                >
                  📸 Ver foto
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Image Gallery Modal - OUTSIDE the map */}
      <ImageGallery
        images={galleryState.images}
        isOpen={galleryState.isOpen}
        onClose={closeGallery}
      />
    </>
  );
}