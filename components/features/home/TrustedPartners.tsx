"use client";

import Link from "next/link";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";
import { ArrowRight } from "lucide-react";

const partners = [
  { name: "TechCorp Ghana", type: "Technology" },
  { name: "Innovation Hub Africa", type: "Innovation" },
  { name: "Global Solutions Ltd", type: "Consulting" },
  { name: "Digital Ventures", type: "Finance" },
  { name: "Campus Connect", type: "Education" },
  { name: "AfriMedia Group", type: "Media" },
  { name: "Koforidua Tech Uni", type: "Institution" },
  { name: "GhanaLink Media", type: "Media" },
];

const PartnerItem = ({ name, type }: { name: string; type: string }) => (
  <div className="flex items-center gap-3 mx-10 sm:mx-14 shrink-0 group cursor-default select-none">
    <span className="text-xl sm:text-2xl md:text-3xl font-light font-serif text-foreground/25 group-hover:text-foreground/60 transition-colors duration-500 tracking-tight">
      {name}
    </span>
    <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground/30 uppercase mt-1 shrink-0">
      {type}
    </span>
  </div>
);

const TrustedPartners = () => {
  return (
    <section className="bg-card feature-no py-16 md:py-24 overflow-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16">
        <div>
          <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground block mb-3">
            OUR PARTNERS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight leading-tight">
            Brands that believe
            <br />
            <span className="text-muted-foreground/50">in campus culture.</span>
          </h2>
        </div>
        <Link
          href="/become-partner"
          className="group flex items-center gap-2 text-sm font-mono tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0 pb-1"
        >
          BECOME A PARTNER
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Marquee */}
      <div className="relative -mx-4 md:-mx-8 lg:-mx-16">
        <ScrollVelocityContainer>
          <ScrollVelocityRow baseVelocity={4} direction={1}>
            {partners.map((partner) => (
              <PartnerItem key={partner.name} {...partner} />
            ))}
            <span className="mx-10 text-muted-foreground/20 text-2xl select-none font-serif">·</span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-card to-transparent" />
      </div>

      {/* Bottom strip */}
      <div className="mt-12 md:mt-16 pt-8 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
          Trusted by institutions, media houses, and brands across Ghana to
          celebrate student excellence.
        </p>
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-muted-foreground/50 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary/60" />
          {partners.length}+ ACTIVE PARTNERS
        </div>
      </div>

    </section>
  );
};

export default TrustedPartners;
