export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      
      {/* Icon */}
      <div className="text-5xl mb-6">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-blue-900 mb-4">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>

    </div>
  );
}