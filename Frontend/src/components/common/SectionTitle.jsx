export default function SectionTitle({ 
  badge, 
  title, 
  subtitle, 
  centered = true 
}) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {badge && (
        <span className="inline-block mb-4 px-4 py-1 bg-amber-400 text-amber-900 text-sm font-bold rounded-full uppercase tracking-wide">
          {badge}
        </span>
      )}
      
      <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}