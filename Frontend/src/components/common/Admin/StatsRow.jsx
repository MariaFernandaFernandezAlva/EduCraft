// src/components/common/Admin/StatsRow.jsx
// Fila de tarjetas de métricas de la cabecera de cada sección.

export default function StatsRow({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((card) => (
        <div
          key={card.label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              card.tone || "bg-slate-100 text-slate-600"
            }`}
          >
            {/* Por defecto el primer carácter del valor; se puede pasar un icono propio */}
            {card.icon ? <card.icon className="h-4.5 w-4.5" /> : String(card.value).charAt(0)}
          </span>

          <div className="min-w-0">
            <p className="font-serif text-lg font-bold text-slate-900">
              {card.value}
            </p>
            <p className="truncate text-[11px] text-slate-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}