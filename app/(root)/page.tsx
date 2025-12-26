import FeatureGridBento from "@/components/features/home/FeatureGrid";
import OurEvents from "@/components/features/home/OurEvents";
import StackingCardsHero from "@/components/features/home/StackingCards";
import { ScrollBasedVelocityDemo } from "@/components/features/home/ScrollBasedVelocityDemo";
import TrustedPartners from "@/components/features/home/TrustedPartners";
import ValuePropositionSection from "@/components/features/home/ValuePropositionSection";

export default function Home() {
  return (
    <main>
      <StackingCardsHero />
      <ValuePropositionSection />
      <ScrollBasedVelocityDemo />
      <FeatureGridBento />
      <OurEvents/>
      <TrustedPartners/>
    </main>
  );
}
