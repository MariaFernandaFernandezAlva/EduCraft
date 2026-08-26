import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServicesSection";
import HowItWorks from "../components/home/HowItWorks";
import PriceSection from "../components/home/PriceSection";
import Testimonials from "../components/home/Testimonials";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <Testimonials />
      <PriceSection />
    </main>
  );
}