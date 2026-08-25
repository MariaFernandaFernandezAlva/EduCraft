export default function ServiceCard({ icon, title, description, borderColor, iconColor }) {
  return (
    <div className={`bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 ${borderColor}`}>
      
      {/* Icon */}
      <div className={`w-fit p-4 text-5xl mb-6 rounded-lg ${iconColor}`}>
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