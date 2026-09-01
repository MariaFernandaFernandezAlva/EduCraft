// src/components/common/Admin/Toolbar.jsx
// Buscador + chips de filtro + selector de vista.
// Componente controlado: el estado vive en la página que lo usa.

const VIEW_OPTIONS = [
  {
    id: "table",
    label: "Vista de tabla",
    path: <path d="M3 6h14M3 10h14M3 14h14" />,
  },
  {
    id: "grid",
    label: "Vista de tarjetas",
    path: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </>
    ),
  },
];

export default function Toolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  options = [],
  activeOption,
  onOptionChange,
  view,
  onViewChange,
}) {

  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option
  );

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      {/* Búsqueda */}
      <div className="relative min-w-48 flex-1">
        <svg
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm outline-hidden focus:border-blue-400"
        />
      </div>

      {/* Chips de filtro */}
      {options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {normalized.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onOptionChange(option.value)}
              aria-pressed={option.value === activeOption}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                option.value === activeOption
                  ? "bg-blue-950 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Selector de vista: solo si la página lo pide.
          Oculto en móvil, donde siempre se muestran tarjetas. */}
      {onViewChange && (
        <div className="hidden overflow-hidden rounded-lg border border-slate-200 lg:flex">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onViewChange(option.id)}
              aria-label={option.label}
              aria-pressed={view === option.id}
              className={`p-2 transition-colors ${
                view === option.id
                  ? "bg-blue-950 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                {option.path}
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}