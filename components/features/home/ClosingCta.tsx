"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StartEventButton from "@/components/shared/start-event-button";
import { ArrowRight } from "lucide-react";
import { useGallery } from "@/hooks/use-gallery";

const ClosingCta = () => {
  const { photos } = useGallery();
  const backdrop = (photos.find((p) => p.isFeatured) ?? photos[0])?.url?.[0];

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      {backdrop && (
        <div className="absolute inset-0">
          <Image
            fill
            src={backdrop}
            alt=""
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/85 to-primary/25" />
        </div>
      )}

      <div className="relative z-10 feature-no py-24 md:py-32 flex flex-col items-start">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-secondary mb-6">
          This could be your event
        </span>

        <h2 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light font-serif tracking-tight leading-[0.95] max-w-3xl">
          Your event deserves
          <br />
          <span className="text-secondary italic">its own stage.</span>
        </h2>

        <p className="mt-8 text-base md:text-lg font-light text-primary-foreground/60 max-w-md leading-relaxed">
          Whether it&apos;s an awards night, a ticketed evening, or both — your audience is already here.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <StartEventButton size="lg" variant="secondary">
            Start an Event
            <ArrowRight className="ml-2 w-4 h-4" />
          </StartEventButton>
          <Button
            size="lg"
            className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
            asChild
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>

        <p className="mt-8 text-[11px] font-mono tracking-[0.15em] uppercase text-primary-foreground/40">
          Go live the same day · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default ClosingCta;
