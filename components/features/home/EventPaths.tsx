"use client";

import Link from "next/link";
import { ArrowRight, Award, CheckCircle2, Ticket } from "lucide-react";

const paths = [
  {
    number: "01",
    icon: Award,
    tag: "AWARD VOTING",
    title: "Run an awards event",
    description:
      "Open nominations, structure categories, and let the public decide. Every vote is paid, verified, and reflected on a live leaderboard — built to crown a winner the whole campus believes in.",
    points: ["Nominations & category structuring", "Pay-per-vote or bulk pricing", "Real-time leaderboards"],
    cta: { label: "See how voting works", href: "/how-it-works" },
    theme: "dark" as const,
  },
  {
    number: "02",
    icon: Ticket,
    tag: "TICKETED EVENTS",
    title: "Just sell tickets",
    description:
      "No nominations, no voting — just a gathering worth attending. Set ticket tiers, sell online, and check guests in at the door with a single scan.",
    points: ["Multiple ticket tiers per event", "QR tickets, no printing required", "Door check-in for staff"],
    cta: { label: "Explore ticketed events", href: "/events" },
    theme: "light" as const,
  },
];

export default function EventPaths() {
  return (
    <section className="bg-background text-foreground">
      {/* Header row */}
      <div className="feature-no pt-20 md:pt-28 pb-14 md:pb-16">
        <div className="mb-6 flex items-center gap-6">
          <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground shrink-0">
            ONE PLATFORM, TWO WAYS TO GATHER
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-[1.05] max-w-3xl">
          Whether it&apos;s recognition, or
          <br />
          <span className="opacity-60">just a great night out.</span>
        </h2>
      </div>

      {/* Asymmetric split */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {paths.map((path) => {
          const isDark = path.theme === "dark";
          const Icon = path.icon;
          return (
            <div
              key={path.number}
              className={`relative feature-no py-16 md:py-20 flex flex-col ${
                isDark ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
              }`}
            >
              <span
                className={`absolute right-6 top-6 md:right-10 md:top-10 text-[100px] md:text-[140px] font-serif font-bold leading-none select-none pointer-events-none ${
                  isDark ? "text-primary-foreground/[0.05]" : "text-foreground/[0.04]"
                }`}
              >
                {path.number}
              </span>

              <div className="relative z-10 max-w-lg">
                <Icon
                  className={`w-9 h-9 mb-6 ${isDark ? "text-secondary" : "text-primary"}`}
                  strokeWidth={1.5}
                />

                <span
                  className={`text-[10px] font-mono tracking-[0.25em] uppercase ${
                    isDark ? "text-secondary/80" : "text-muted-foreground"
                  }`}
                >
                  {path.tag}
                </span>

                <h3 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-light font-serif tracking-tight leading-tight mb-6">
                  {path.title}
                </h3>

                <p
                  className={`text-base font-light leading-relaxed mb-10 ${
                    isDark ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}
                >
                  {path.description}
                </p>

                <ul className="space-y-4 mb-12">
                  {path.points.map((point) => (
                    <li
                      key={point}
                      className={`flex items-start gap-3 text-sm font-light pb-4 border-b ${
                        isDark ? "border-primary-foreground/10 text-primary-foreground/70" : "border-border/50 text-foreground/70"
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? "text-secondary" : "text-primary/70"}`}
                        strokeWidth={1.5}
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <Link
                  href={path.cta.href}
                  className={`group inline-flex items-center gap-2.5 text-sm font-light hover:gap-4 transition-all duration-300 ${
                    isDark ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {path.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Organizer nudge */}
      <div className="feature-no py-8 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
          Running an event with both? Add ticketing to any awards event, or vice versa — it&apos;s your call.
        </p>
        <Link
          href="/become-partner"
          className="group flex items-center gap-2 text-sm font-mono tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors duration-300 shrink-0"
        >
          START AN EVENT
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </section>
  );
}
