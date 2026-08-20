export default function StepCard({ number, icon, title, description }) {
  return (
    <div className="text-center">
      
      {/* Number Circle */}
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-amber-400 text-amber-900 flex items-center justify-center">
          <span className="text-3xl font-bold">{number}</span>
        </div>
      </div>

      {/* Icon */}
      <div className="text-5xl mb-4">
        {icon}
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