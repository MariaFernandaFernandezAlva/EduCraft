export default function TestimonialCard({ name, role, rating, comment }) {
  
  // Renderizar estrellas según rating
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-amber-400 text-xl" : "text-gray-300 text-xl"}>
      ★
    </span>
  ));

  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300">
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {stars}
      </div>

      {/* Comment */}
      <p className="text-gray-700 leading-relaxed mb-6 italic">
        "{comment}"
      </p>

      {/* User Info */}
      <div className="border-t border-gray-100 pt-4">
        <p className="font-bold text-blue-900">
          {name}
        </p>
        <p className="text-sm text-gray-600">
          {role}
        </p>
      </div>

    </div>
  );
}