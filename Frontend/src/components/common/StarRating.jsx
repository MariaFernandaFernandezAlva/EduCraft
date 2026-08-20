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

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Calificación
      </label>
      
      <div className="flex gap-2 items-center">
        <div className="flex gap-3 cursor-pointer" onMouseLeave={handleMouseLeave}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => handleStarHover(star)}
              className={`text-4xl transition-all duration-200 transform hover:scale-110 ${
                star <= displayRating 
                  ? "text-amber-400" 
                  : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <span className="text-sm font-semibold text-gray-700 ml-4">
          {displayRating}/5
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {displayRating === 5 && "¡Excelente!"}
        {displayRating === 4 && "Muy bueno"}
        {displayRating === 3 && "Bueno"}
        {displayRating === 2 && "Regular"}
        {displayRating === 1 && "Necesita mejora"}
      </p>
    </div>
  );
}