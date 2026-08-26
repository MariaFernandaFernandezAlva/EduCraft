import SectionTitle from "../common/SectionTitle";
import Button from "../common/Button";

export default function PriceSection() {
  return (
    <section id="cotizacion" className="panel2 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">
            ¿Listo para tu próximo proyecto?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Recibe una cotización personalizada en menos de 24 horas. Sin compromiso.
        </p>
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-row items-center justify-center gap-4">
          <Button variant="primary" size="sm">
            Pedir Cotización gratis
          </Button>
          <Button variant="secondary" size="sm">
            Ver portafolio
          </Button>
        </div>
      </div>
    </section>
  );
}