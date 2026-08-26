import SectionTitle from "../common/SectionTitle";
import TestimonialCard from "./TestimonialCard";
import { testimonialsData } from "../../data/testimonial";

export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-gray py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="TESTIMONIOS"
          badgeColor="amarillo"
          title="Lo que dicen nuestros clientes"
          subtitle="Historias reales de estudiantes y familias satisfechas"
        />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              id={testimonial.id}
              name={testimonial.name}
              role={testimonial.role}
              rating={testimonial.rating}
              comment={testimonial.comment}
            />
          ))}
        </div>

      </div>
    </section>
  );
}