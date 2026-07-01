"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const ClosingCta = () => {
  return (
    <section className="bg-primary text-primary-foreground feature-no py-24 md:py-32 relative overflow-hidden">
      <div className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-secondary" strokeWidth={1.75} />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-primary-foreground/60">
            Ready when you are
          </span>
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.05] max-w-3xl">
          Your event deserves
          <br />
          <span className="text-secondary italic">its own stage.</span>
        </h2>

        <p className="mt-8 text-base md:text-lg font-light text-primary-foreground/50 max-w-md leading-relaxed">
          Whether it&apos;s an awards night, a ticketed evening, or both — start free and go live the same day.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/become-partner">
              Start an Event
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
            asChild
          >
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClosingCta;
