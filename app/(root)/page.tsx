import ClosingCta from "@/components/features/home/ClosingCta";
import EventPaths from "@/components/features/home/EventPaths";
import FAQ from "@/components/features/home/FAQ";
import FeatureGridBento from "@/components/features/home/FeatureGrid";
import GalleryPreview from "@/components/features/home/GalleryPreview";
import Hero from "@/components/features/home/Hero";
import OurEvents from "@/components/features/home/OurEvents";
import ProductShowcase from "@/components/features/home/ProductShowcase";
import Testimonials from "@/components/features/home/Testimonials";
import TrustedPartners from "@/components/features/home/TrustedPartners";
import ValuePropositionSection from "@/components/features/home/ValuePropositionSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative z-10">
        <EventPaths />
        <OurEvents />
        <GalleryPreview />
        <ProductShowcase />
        <ValuePropositionSection />
        <FeatureGridBento />
        <Testimonials />
        <TrustedPartners />
        <FAQ />
        <ClosingCta />
      </div>
    </main>
  );
}
