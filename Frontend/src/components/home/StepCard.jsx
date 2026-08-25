export default function StepCard({ number, icon, title, description }) {

  return (
    <div className="text-center">
      
      {/* Number Circle */}
      <div className="mb-6 flex justify-center">
        <div className=" w-24 h-24 rounded-full bg-azul text-white flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{number}</span>
          <div className="w-8 h-8">{icon}</div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-blue-900 mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}