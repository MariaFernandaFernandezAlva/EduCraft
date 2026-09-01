import { useState } from "react";

export default function StarRating({ value = 5, onChange }) {
  const [hoverRating, setHoverRating] = useState(null);

  const handleStarClick = (rating) => {
    onChange(rating);
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const displayRating = hoverRating || value;

  const getMessage = (rating) => {
    switch (rating) {
      case 5: return "¡Excelente!";
      case 4: return "Muy bueno";
      case 3: return "Bueno";
      case 2: return "Regular";
      case 1: return "Necesita mejora";
      default: return "";
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider uppercase text-gray-700 mb-2">
        Calificación
      </label>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex gap-1.5 cursor-pointer items-center" onMouseLeave={handleMouseLeave}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              className={`text-2xl transition-all duration-150 transform hover:scale-110 focus:outline-none ${
                star <= displayRating 
                  ? "text-amber-400" 
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-azul">
            {displayRating}/5
          </span>
          <span className="text-sm font-semibold text-marron px-2.5 py-0.5 rounded-full border border-amber-100/60">
            {getMessage(displayRating)}
          </span>
        </div>
      </div>
    </div>
  );
}