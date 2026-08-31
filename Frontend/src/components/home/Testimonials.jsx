import SectionTitle from "../common/SectionTitle";
import TestimonialCard from "./TestimonialCard";
import { useState, useEffect } from "react";
import { getApprovedTestimonials } from "../../services/api";

export default function Testimonials() {

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const result = await getApprovedTestimonials();
      if (result.success) {
        // Solo tres en el home; el resto se ven en /community.
        setTestimonials(
          [...result.data]
            .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
            .slice(0, 3)
        );
      }
    };
    fetchTestimonials();
  }, []);

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
          {testimonials.map((testimonial) => (
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