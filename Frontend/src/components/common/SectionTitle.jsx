export default function SectionTitle({ 
  badge, badgeColor,
  title, 
  subtitle, 
  centered = true 
}) {
  const badgeStyles = {
    amarillo: "bg-[#fef3dc] text-marron",
    azul: "bg-[#d9ddea] text-azul",
  }

  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {badge && (
        <span className={`inline-block mb-4 px-4 py-1  text-sm font-bold rounded-full uppercase tracking-wide ${badgeStyles[badgeColor]}`}>
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