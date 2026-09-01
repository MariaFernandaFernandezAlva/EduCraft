import QuotationForm from "../components/quotation/QuotationForm";
import FAQ from "../components/quotation/FAQ";
import QuickConsult from "../components/quotation/QuickConsult";

export default function Quotation() {
  return (
    <main className="bg-gray">
      {/* Hero Section - Cotización */}
      <section className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-16 md:py-24 text-slate-900 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6">
            {/* Etiqueta superior con línea */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-amarillo"></div>
              <span className="text-xs font-semibold tracking-widest text-marron uppercase">
                Cotización
              </span>
            </div>

            {/* Título principal con degradado */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight mb-5">
              Arma tu proyecto <br></br> paso a paso
            </h2>

            {/* Descripción */}
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
              Tres pasos, cinco minutos. A medida que completas el formulario
              verás tu resumen actualizarse en tiempo real y recibirás la
              propuesta en menos de 24 horas.
            </p>

            {/* Badges / Viñetas informativas */}
            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <span className="text-teal-700">⏱️</span> 5-10 min de llenado
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <span className="text-emerald-600 font-bold">✓</span> Respuesta
                en 24 h
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-medium text-slate-700">
                <span className="text-emerald-600">✨</span> Sin compromiso
              </div>
            </div>

            {/* Tarjeta de Estadísticas inferiores */}
            <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 grid grid-cols-3 divide-x divide-slate-100 overflow-hidden p-2">
              <div className="p-4 text-left">
                <div className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-0.5">
                  480+
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Proyectos
                </div>
              </div>

              <div className="p-4 text-left pl-6">
                <div className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-0.5">
                  24–72 h
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Entrega
                </div>
              </div>

              <div className="p-4 text-left pl-6">
                <div className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-0.5">
                  4.9/5
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Satisfacción
                </div>
              </div>
            </div>
          </div>

          {/* Right Images Collage Layout */}
          <div className="lg:col-span-6 relative flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Imagen superior 1 */}
              <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                <img
                  src="/images/projects/maqueta.webp"
                  alt="Proyecto Maqueta"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
              {/* Imagen superior 2 */}
              <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                <img
                  src="/images/projects/Triptico.webp"
                  alt="Proyecto Lámina"
                  className="w-full h-48 object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Imagen inferior amplia */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
              <img
                src="/images/projects/cuaderno.webp"
                alt="Proyecto Tríptico"
                className="w-full h-52 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-gray py-16 md:py-24">
        <QuotationForm />
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Quick Consult Section */}
      <QuickConsult />
    </main>
  );
}
