export default function TestimonialCard({ id, name, role, rating, comment }) {
  
  // Renderizar estrellas según rating
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < rating ? "text-amber-400 text-xl" : "text-gray-300 text-xl"}>
      ★
    </span>
  ));

  return (
    <div className={`rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 ${id === 2 ? "bg-azul" : "bg-white"}`}>
      
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {stars}
      </div>

      {/* Comment */}
      <p className={`leading-relaxed mb-6 ${id === 2 ? "text-white" : "text-gray-500"}`}>
        "{comment}"
      </p>

      {/*Logo + Info*/}
      <div className="flex flex-row gap-3 pt-4">
        {/*Avatar*/}
        <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
          <span className="text-azul font-bold text-lg">
            {name ? name.charAt(0).toUpperCase() : ""}
          </span>
        </div>
        {/* User Info */}
        <div>
          <p className={`font-bold ${ id === 2 ? "text-white" : "text-azul"}`}>
            {name}
          </p>
          <p className={`text-sm ${ id === 2 ? "text-gray-300" : "text-gray-600"}`}>
            {role}
          </p>
        </div>
      </div>
      

    </div>
  );
}