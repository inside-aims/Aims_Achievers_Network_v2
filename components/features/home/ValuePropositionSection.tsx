"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  QrCode,
  Radio,
  Repeat,
  Ticket,
  Trophy,
  Users,
  Vote,
  Wallet,
} from "lucide-react";

const orbitIcons = [
  { icon: Vote, x: 20, y: 26 },
  { icon: Ticket, x: 78, y: 18 },
  { icon: QrCode, x: 88, y: 62 },
  { icon: Wallet, x: 66, y: 90 },
  { icon: Users, x: 22, y: 80 },
  { icon: Radio, x: 8, y: 52 },
  { icon: CalendarCheck, x: 50, y: 6 },
];

const cellClass =
  "p-6 md:p-8 flex flex-col hover:bg-primary-foreground/[0.03] transition-colors duration-500";

const ValuePropositionSection = () => {
  return (
    <section
      id="value-prop-section"
      className="bg-primary text-primary-foreground feature-no py-20 md:py-28 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      <div className="relative z-10">
        {/* Label row */}
        <div className="mb-14 md:mb-16 flex items-center gap-6">
          <span className="text-xs tracking-[0.25em] font-mono text-primary-foreground/30 shrink-0">
            WHY AIMS ACHIEVERS NETWORK
          </span>
          <div className="h-px flex-1 bg-primary-foreground/10" />
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif tracking-tight leading-[1.0] mb-14 md:mb-16 max-w-3xl">
          Redefining how excellence
          <br />
          is recognized, and how
          <br />
          moments are{" "}
          <span className="text-secondary italic">celebrated.</span>
        </h2>

        {/* Credibility bento grid — monospace, shared borders */}
        <div className="border border-primary-foreground/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/10 font-mono">

          {/* Cell 1: illustration */}
          <div className={cellClass}>
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-4 h-4 text-primary-foreground/50" strokeWidth={1.75} />
              <span className="text-sm text-primary-foreground/70">community</span>
            </div>
            <div className="relative flex-1 min-h-64 rounded-md border border-primary-foreground/10 bg-primary-foreground/[0.02] overflow-hidden">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-primary-foreground/10" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-primary-foreground/10" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-secondary" strokeWidth={1.5} />
              </span>
              {orbitIcons.map(({ icon: Icon, x, y }, i) => (
                <span
                  key={i}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-primary-foreground/5 border border-primary-foreground/15 flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-secondary" strokeWidth={1.5} />
                </span>
              ))}
            </div>
          </div>

          {/* Cell 2: community stat, icon-in-box header */}
          <div className={cellClass}>
            <div className="flex items-center justify-center rounded-md border border-primary-foreground/10 bg-primary-foreground/[0.02] py-10 mb-6">
              <Award className="w-10 h-10 text-secondary" strokeWidth={1.25} />
            </div>
            <p className="text-base text-primary-foreground/90 mb-4">
              500+ students engaged every event
            </p>
            <p className="text-sm text-primary-foreground/40 leading-relaxed">
              See what other organizers are running, get help fast, and get inspired by{" "}
              <Link href="/events" className="text-secondary hover:underline">
                what&apos;s live on the platform
              </Link>
              {" "}right now.
            </p>
          </div>

          {/* Cell 3: two stacked stats */}
          <div className="flex flex-col divide-y divide-primary-foreground/10">
            <div className={`${cellClass} flex-1`}>
              <Repeat className="w-5 h-5 text-primary-foreground/50 mb-4" strokeWidth={1.75} />
              <p className="text-base text-primary-foreground/90 mb-4">
                9 in 10 organizers rerun with us
              </p>
              <p className="text-sm text-primary-foreground/40 leading-relaxed">
                Real payouts, real turnout — organizers come back for their next event.
              </p>
            </div>
            <div className={`${cellClass} flex-1`}>
              <Wallet className="w-5 h-5 text-primary-foreground/50 mb-4" strokeWidth={1.75} />
              <p className="text-base text-primary-foreground/90 mb-4">
                GHS 50,000+ paid out
              </p>
              <p className="text-sm text-primary-foreground/40 leading-relaxed">
                Straight to mobile money or bank, automatically split every time a vote or ticket clears.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-3 mt-10">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto sm:flex-1 sm:max-w-xs" asChild>
            <Link href="/events">
              View Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            className="w-full sm:w-auto sm:flex-1 sm:max-w-xs bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
            asChild
          >
            <Link href="/how-it-works">See How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
