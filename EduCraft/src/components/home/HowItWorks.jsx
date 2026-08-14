import SectionTitle from "../common/SectionTitle";
import StepCard from "../home/StepCard";
import { howItWorksData } from "../../data/howItWorks";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="NUESTRO PROCESO"
          title="Cómo Funciona"
          subtitle="Un proceso simple y eficiente para tu tranquilidad"
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorksData.map((step) => (
            <StepCard
              key={step.id}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}