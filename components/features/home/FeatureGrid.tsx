"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Ban, CheckCircle2, Rocket } from "lucide-react";

const branches = [
  {
    steps: [
      { title: "Open voting", meta: "1,204 votes", done: true },
      { title: "Show leaderboard", meta: "Live now", done: true },
    ],
  },
  {
    steps: [
      { title: "Sell tickets", meta: "842 sold", done: true },
      { title: "Scan at the door", meta: "612 checked in", done: true },
    ],
  },
  {
    steps: [
      { title: "Accept nominations", meta: "Skipped for this event", done: false },
    ],
  },
];

function FlowLine({
  orientation,
  active = true,
  className = "",
}: {
  orientation: "horizontal" | "vertical";
  active?: boolean;
  className?: string;
}) {
  const isH = orientation === "horizontal";
  return (
    <div
      className={`relative shrink-0 ${isH ? "h-px" : "w-px"} ${active ? "bg-border" : "bg-border/40"} ${className}`}
    >
      {active && (
        <motion.div
          className={
            isH
              ? "absolute top-1/2 -translate-y-1/2 h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent via-secondary to-transparent"
              : "absolute left-1/2 -translate-x-1/2 w-0.5 h-10 rounded-full bg-gradient-to-b from-transparent via-secondary to-transparent"
          }
          animate={isH ? { left: ["-15%", "115%"] } : { top: ["-15%", "115%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

function TriggerCard() {
  return (
    <div className="w-full lg:w-64 self-center shrink-0 border border-border rounded-lg bg-card p-6 lg:p-5 shadow-sm">
      <h3 className="text-lg lg:text-sm font-medium text-foreground mb-5 lg:mb-4">Publish event</h3>
      <div className="space-y-4 lg:space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm lg:text-xs text-muted-foreground shrink-0">Format</span>
          <span className="text-sm lg:text-xs font-medium border border-border rounded px-3 py-2 lg:px-2.5 lg:py-1.5 bg-background truncate">
            Awards + Tickets
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm lg:text-xs text-muted-foreground shrink-0">Category</span>
          <span className="text-sm lg:text-xs font-medium border border-border rounded px-3 py-2 lg:px-2.5 lg:py-1.5 bg-background truncate">
            Best Dressed
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm lg:text-xs text-muted-foreground">Published</span>
          <span className="w-10 h-6 lg:w-9 lg:h-5 rounded-full bg-foreground flex items-center px-0.5 justify-end shrink-0">
            <span className="w-5 h-5 lg:w-4 lg:h-4 rounded-full bg-background" />
          </span>
        </div>
      </div>
    </div>
  );
}

function HubNode() {
  return (
    <div className="shrink-0 flex items-center gap-2.5 lg:gap-2 border border-border rounded-lg bg-card px-5 py-4 lg:px-4 lg:py-3 shadow-sm">
      <Rocket className="w-5 h-5 lg:w-4 lg:h-4 text-muted-foreground" strokeWidth={2} />
      <span className="text-base lg:text-sm font-medium">Go live</span>
    </div>
  );
}

function StatusCard({
  title,
  meta,
  done,
  fixedWidth,
}: {
  title: string;
  meta: string;
  done: boolean;
  fixedWidth?: boolean;
}) {
  return (
    <div
      className={`${fixedWidth ? "w-44 xl:w-52 shrink-0" : "w-full"} border border-border rounded-lg bg-card px-5 py-4 lg:px-4 lg:py-3 shadow-sm`}
    >
      <div className="flex items-center gap-2.5 lg:gap-2 mb-1.5 lg:mb-1">
        {done ? (
          <CheckCircle2 className="w-5 h-5 lg:w-4 lg:h-4 text-emerald-600 shrink-0" strokeWidth={2} />
        ) : (
          <Ban className="w-5 h-5 lg:w-4 lg:h-4 text-muted-foreground/40 shrink-0" strokeWidth={2} />
        )}
        <span className="text-base lg:text-sm font-medium text-foreground truncate">{title}</span>
      </div>
      <span className="text-sm lg:text-xs text-muted-foreground pl-7 lg:pl-6">{meta}</span>
    </div>
  );
}

function Branches() {
  return (
    <div className="border border-border/40 rounded-xl p-4">
      <div className="relative flex flex-col gap-6">
        <div className="absolute left-0 top-14 bottom-14 w-px bg-border" />
        {branches.map((branch, i) => {
          const rowDone = branch.steps[0].done;
          return (
            <div key={i} className="h-28 flex items-center">
              <FlowLine orientation="horizontal" active={rowDone} className="w-8" />
              <StatusCard {...branch.steps[0]} fixedWidth />
              {branch.steps[1] && (
                <>
                  <FlowLine orientation="horizontal" active={rowDone} className="w-8" />
                  <StatusCard {...branch.steps[1]} fixedWidth />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FeatureGridBento = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative bg-background text-foreground feature-no py-20 sm:py-24 md:py-28 overflow-hidden"
    >
      {/* Dot-grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:22px_22px] opacity-40 pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-[1.05] mb-4 max-w-2xl">
          One event, run
          <br />
          <span className="opacity-60">automatically.</span>
        </h2>
        <p className="text-base font-light text-muted-foreground max-w-md mb-16 md:mb-20">
          Publish once. Voting, ticket sales, and check-in all run themselves from there.
        </p>

        {/* Desktop: full-width branching diagram */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
          className="hidden lg:flex items-stretch w-full transition-all duration-700 ease-out"
        >
          <TriggerCard />
          <FlowLine orientation="horizontal" className="flex-1 min-w-10 self-center" />
          <div className="self-center"><HubNode /></div>
          <FlowLine orientation="horizontal" className="flex-1 min-w-10 self-center" />
          <Branches />
        </div>

        {/* Mobile: same branching diagram, stacked vertically, comfortably sized (not full-bleed) */}
        <div
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
          className="lg:hidden flex flex-col items-center gap-0 transition-all duration-700 ease-out"
        >
          <div className="w-full max-w-sm">
            <TriggerCard />
          </div>
          <FlowLine orientation="vertical" className="h-8" />
          <HubNode />
          <FlowLine orientation="vertical" className="h-8" />
          <div className="w-full max-w-sm ">
            <Branches />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGridBento;
