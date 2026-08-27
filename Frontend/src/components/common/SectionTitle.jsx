export default function SectionTitle({ 
  badge, badgeColor,
  title, 
  subtitle, 
  centered = true,
  variant = "default",
  as: Tag = "h2"
}) {

  const badgeColors = {
    amarillo: "bg-[#fef3dc] text-marron",
    azul: "bg-[#d9ddea] text-azul",
    amber: "bg-amber-400 text-azul",
  }

  const variantStyles = {
    default: {
      wrapper: "mb-12",
      badge: "mb-4 py-1",
      title: "text-4xl md:text-5xl font-bold text-azul mb-4",
      subtitle: "text-lg text-gray-600 max-w-2xl mx-auto"
    },
    hero: {
      wrapper: "mb-0",
      badge: "mb-6 py-2",
      title: "text-4xl md:text-6xl font-bold text-white leading-tight mb-6",
      subtitle: "text-base md:text-xl text-white/60 mb-8 leading-relaxed max-w-3xl mx-auto"
    },
    sections: {
      wrapper: "mb-12",
      badge: "mb-4 py-1",
      title: "text-4xl md:text-5xl font-bold text-azul mb-4",
      subtitle: "text-lg text-gray-600 max-w-2xl"
    }

  };

  const activeStyles = variantStyles[variant];

  return (
    <div className={`${activeStyles.wrapper} ${centered ? "text-center" : ""}`}>
      {badge && (
        <span className={`inline-block px-4 text-sm font-bold rounded-full uppercase tracking-wide ${activeStyles.badge} ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
      
      {/* Usamos <Tag> para renderizar h1 o h2 dinámicamente */}
      <Tag className={activeStyles.title}>
        {title}
      </Tag>
      
      {subtitle && (
        <p className={activeStyles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
}