import SectionTitle from "../common/SectionTitle";
import StepCard from "../home/StepCard";
import { howItWorksData } from "../../data/howItWorks";
import { ChatBubbleLeftRightIcon, DocumentTextIcon, CubeIcon   } from "@heroicons/react/24/outline"
import Button from "../common/Button"
import { useNavigate } from "react-router-dom";

const Icons = [
  <ChatBubbleLeftRightIcon className="w-6 h-6" />, 
  <DocumentTextIcon className="w-6 h-6" />, 
  <CubeIcon className="w-6 h-6" />
]

export default function HowItWorks() {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <section id="como-funciona" className="bg-[#eef0f8] py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="NUESTRO PROCESO"
          badgeColor="azul"
          title="Cómo Funciona"
          subtitle="Un proceso simple y eficiente para tu tranquilidad"
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorksData.map((step) => (
            <StepCard
              key={step.id}
              number={step.number}
              icon={Icons[step.id - 1]}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/*Boton*/}
        <div className="flex justify-center mt-12 md:mt-16">
          <Button variant="tertiary" size="md" onClick={() => handleNavigate("/quotation")}>
            Comenzar ahora
          </Button>
        </div>

      </div>
    </section>
  );
}