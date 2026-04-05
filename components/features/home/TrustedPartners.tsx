"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

const partners = [
  {
    name: "TechCorp Ghana",
    industry: "Technology",
    type: "Official Partner",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Innovation Hub Africa",
    industry: "Innovation",
    type: "Trusted Partner",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Global Solutions Ltd",
    industry: "Consulting",
    type: "Strategic Partner",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Digital Ventures",
    industry: "Finance",
    type: "Official Partner",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Campus Connect",
    industry: "Education",
    type: "Strategic Partner",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "AfriMedia Group",
    industry: "Media",
    type: "Media Partner",
    image:
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&auto=format&fit=crop&q=80",
  },
];

const PartnerItem = ({
  name,
  industry,
  type,
  image,
}: (typeof partners)[0]) => (
  <div className="flex items-center gap-4 mx-8 sm:mx-12 shrink-0 group cursor-pointer">
    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm overflow-hidden bg-muted shrink-0 ring-1 ring-border group-hover:ring-foreground/30 transition-all duration-300">
      <Image
        src={image}
        alt={name}
        width={48}
        height={48}
        className="w-full h-full object-cover"
      />
    </div>
    <div>
      <p className="text-sm font-serif font-light text-foreground leading-tight group-hover:text-foreground transition-colors duration-300">
        {name}
      </p>
      <p className="text-xs text-muted-foreground font-mono tracking-widest mt-0.5">
        {industry} · {type}
      </p>
    </div>
  </div>
);

const TrustedPartners = () => {
  return (
    <section className="bg-card text-foreground feature-no py-16 md:py-24">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-14">
          <div>
            <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground">
              OUR PARTNERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight leading-tight mt-4">
              Trusted by institutions
              <br className="hidden sm:block" />
              <span className="text-muted-foreground"> across Ghana.</span>
            </h2>
          </div>
          <Link
            href="/contact"
            className="text-sm font-mono tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0"
          >
            BECOME A PARTNER →
          </Link>
        </div>

        {/* Marquee */}
        <div className="relative py-6">
          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={6} direction={1}>
              {partners.map((partner) => (
                <PartnerItem key={partner.name} {...partner} />
              ))}
              {/* Separator dot between loop repetitions */}
              <div className="mx-8 text-border select-none">·</div>
            </ScrollVelocityRow>
          </ScrollVelocityContainer>

          {/* Edge fades */}
          <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-linear-to-r" />
          <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-linear-to-l" />
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
