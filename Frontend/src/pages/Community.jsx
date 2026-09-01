import { useState, useEffect } from "react";
import TestimonialsList from "../components/community/TestimonialsList";
import TestimonialForm from "../components/community/TestimonialForm";
import { getApprovedTestimonials } from "../services/api";
import { ArrowRightIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import Button from "../components/common/Button";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

export default function Community() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const result = await getApprovedTestimonials();
      if (result.success) {
        // Más recientes primero.
        setTestimonials(
          [...result.data].sort((a, b) =>
            (b.date || "").localeCompare(a.date || ""),
          ),
        );
      }
    };
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = (nuevo) => {
    setTestimonials((prev) => [nuevo, ...prev]);
  };

  // Función auxiliar para extraer iniciales del nombre (ej. "Paolo Belleza" -> "PB")
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Tomamos los primeros 5 testimonios para mostrar sus avatares en el Hero
  const recentTestimonialsForAvatars = testimonials.slice(0, 5);

  // Testimonio destacado para la tarjeta de la derecha (usamos el primero o uno por defecto)
  const featuredTestimonial = testimonials[0] || {
    name: "Paolo Belleza",
    comment:
      "Me ayudó muchísimo esta empresa, sin ellos no podría haber terminado a tiempo con mi proyecto...",
    project: "Maqueta ADN 3D",
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#FAF9F6] bg-[linear-gradient(to_right,#f0eee9_1px,transparent_1px),linear-gradient(to_bottom,#f0eee9_1px,transparent_1px)] bg-size-[2.5rem_2.5rem] py-16 md:py-24 text-slate-900 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
            {/* Columna Izquierda: Textos y Avatares dinámicos */}
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-0.5 bg-amber-500"></div>
                <span className="text-xs font-semibold tracking-widest text-amber-800 uppercase">
                  Comunidad EduCraft
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,#0c184a_3%,#007a86_100%)] leading-tight mb-5">
                Historias que se <br></br> exponen en clase
              </h2>

              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Detrás de cada maqueta hay una noche de nervios, una nota que
                importaba y una familia apoyando. Estas son las voces de quienes
                ya presentaron su proyecto con nosotros.
              </p>

              {/* Avatares dinámicos sacados de los comentarios + Estrellas */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex -space-x-3 overflow-hidden">
                  {recentTestimonialsForAvatars.length > 0 ? (
                    recentTestimonialsForAvatars.map((item, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-950 text-white text-xs font-bold ring-2 ring-white shadow-sm"
                        title={item.name}
                      >
                        {getInitials(item.name || item.autor)}
                      </div>
                    ))
                  ) : (
                    // Fallback visual si aún cargan o no hay datos
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-950 text-white text-xs font-bold ring-2 ring-white">
                      EC
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    4.9 / 5 en más de 180 opiniones verificadas
                  </span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#formulario"
                  className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white font-medium rounded-full shadow-md transition duration-200 inline-flex items-center gap-2"
                >
                  Comparte tu experiencia
                  <ArrowRightIcon className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#testimonios"
                  className="px-6 py-3 bg-transparent hover:bg-gray-100 text-blue-950 border border-gray-300 font-medium rounded-full transition duration-200"
                >
                  Leer testimonios
                </a>
              </div>
            </div>

            {/* Columna Derecha: Tarjeta de testimonio visual estilo maqueta */}
            <div className="lg:col-span-5 relative">
              <div className="bg-[url('https://i.pinimg.com/1200x/d9/a4/36/d9a436f30fb0507ad651006f439c638b.jpg')] bg-cover bg-center backdrop-blur-md rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
                <div className="absolute top-4 right-4 text-white/50 text-6xl font-serif select-none">
                  “
                </div>

                <div className="flex text-amber-400 mb-4 text-2xl">
                  {"★".repeat(5)}
                </div>

                <p className="text-white/70 text-lg mb-6 leading-relaxed italic">
                  &ldquo;
                  {featuredTestimonial.comment || featuredTestimonial.mensaje}
                  &rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(
                        featuredTestimonial.name || featuredTestimonial.autor,
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">
                        {featuredTestimonial.name ||
                          featuredTestimonial.autor ||
                          "Estudiante"}
                      </h4>
                      <p className="text-xs text-teal-300">
                        {featuredTestimonial.project ||
                          featuredTestimonial.rol ||
                          "Proyecto escolar"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge flotante inferior */}
              <div className="absolute -bottom-8 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex flex-col items-center gap-1">
                <span className="text-xs font-bold tracking-wider text-gray-400 block uppercase">
                  ENTREGADO A TIEMPO
                </span>
                <div className="flex items-center gap-2">
                  <CheckBadgeIcon className="w-6 h-6 text-verde" />
                  <span className="text-sm font-bold text-verde">
                    98 % de los pedidos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="bg-[#faf9f7] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-500 uppercase">
              Lo que dicen de nosotros
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-blue-900 md:text-5xl">
              Testimonios de la comunidad
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Filtra por el tipo de persona con la que más te identificas.
            </p>
          </div>

          <TestimonialsList testimonials={testimonials} />
        </div>
      </section>

      {/* Form Section */}
      <section id="formulario" className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Columna Izquierda: Información y Pasos */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                  Tu turno
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight">
                  Comparte tu experiencia
                </h2>
                <p className="mt-4 text-gray-600 text-base leading-relaxed">
                  ¿Trabajaste con nosotros hace poco? Cuéntanos cómo fue el
                  proceso de creación de tu proyecto. Tu opinión ayuda a otros
                  estudiantes y familias a decidir con confianza.
                </p>
              </div>

              {/* Pasos / Beneficios rápidos */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Toma 2 minutos
                    </h4>
                    <p className="text-sm text-gray-500">
                      Solo cuatro campos y listo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Publicamos con tu nombre
                    </h4>
                    <p className="text-sm text-gray-500">
                      Puedes usar solo tu inicial si prefieres.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Suma tus fotos
                    </h4>
                    <p className="text-sm text-gray-500">
                      Comparte hasta 5 enlaces del resultado final.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini galería decorativa de proyectos */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
                  alt="Proyecto 1"
                  className="rounded-xl h-24 w-full object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80"
                  alt="Proyecto 2"
                  className="rounded-xl h-24 w-full object-cover shadow-sm"
                />
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80"
                  alt="Proyecto 3"
                  className="rounded-xl h-24 w-full object-cover shadow-sm"
                />
              </div>
            </div>

            {/* Columna Derecha: El Formulario */}
            <div className="lg:col-span-7">
              <TestimonialForm onAddTestimonial={handleAddTestimonial} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
            <section className="pb-20 md:pb-32 mx-5">
              <div className="degradado max-w-7xl mx-auto py-8 md:py-10 text-center rounded-4xl">
                <h2 className="text-lg md:text-3xl font-bold text-white mb-6">
                  ¿Listo para tener tu propia historia?
                </h2>
                <p className="text-xs md:text-sm text-white/60 mb-8 mx-8">
                  Cuéntanos qué necesitas y te enviamos una propuesta con fotos de <br></br>
                  referenci el mismo día.
                </p>
                <Button variant="primary" size="md" className="text-black">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" strokeWidth={2}/>
                  Solicitar mi cotización
                </Button>
              </div>
            </section>
    </main>
  );
}
