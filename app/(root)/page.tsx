import ClosingCta from "@/components/features/home/ClosingCta";
import EventPaths from "@/components/features/home/EventPaths";
import FeatureGridBento from "@/components/features/home/FeatureGrid";
import Hero from "@/components/features/home/Hero";
import OurEvents from "@/components/features/home/OurEvents";
import Pillars from "@/components/features/home/Pillars";
import ProductShowcase from "@/components/features/home/ProductShowcase";
import Testimonials from "@/components/features/home/Testimonials";
import TrustedPartners from "@/components/features/home/TrustedPartners";
import ValuePropositionSection from "@/components/features/home/ValuePropositionSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative z-10">
        <Pillars />
        <EventPaths />
        <ProductShowcase />
        <ValuePropositionSection />
        <FeatureGridBento />
        <OurEvents />
        <Testimonials />
        <TrustedPartners />
        <ClosingCta />
      </div>
    </main>
  );
}
