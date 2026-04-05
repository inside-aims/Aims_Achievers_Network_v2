"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MousePointerClick,
  Shield,
  Users,
  BarChart3,
  ArrowRight,
  Plus,
  Zap,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Discover an Event",
    description:
      "Browse active campus award events across Ghanaian institutions - each with its own categories, nominees, and story.",
    note: "Filter by institution, date, or award type to find what matters to you.",
  },
  {
    number: "02",
    icon: Users,
    title: "Pick a Category",
    description:
      "Dive into specific award categories - academic excellence, cultural performance, social impact, and more. Each one tells a different story.",
    note: "Read full nominee profiles and achievements before you decide.",
  },
  {
    number: "03",
    icon: MousePointerClick,
    title: "Choose Your Nominee",
    description:
      "Select the person you believe deserves the award. Your vote is a statement of confidence in their work and character.",
    note: "Nominees see their count update live as votes come in.",
  },
  {
    number: "04",
    icon: Shield,
    title: "Vote Securely",
    description:
      "A quick, encrypted payment confirms your vote. 256-bit protection means every ballot is tamper-proof and permanently recorded.",
    note: "MTN MoMo, Vodafone Cash, AirtelTigo, and cards all accepted.",
  },
  {
    number: "05",
    icon: BarChart3,
    title: "Watch Results Live",
    description:
      "Track the leaderboard as votes roll in. Verified final results are announced at the awards ceremony - no surprises, just transparency.",
    note: "Live tallies visible throughout the entire voting period.",
  },
];

const faqs = [
  {
    q: "How much does it cost to vote?",
    a: "Voting fees are set by the event organiser - typically GHS 1 to GHS 10 per vote. You can cast multiple votes to rally behind your nominee.",
  },
  {
    q: "Is my vote anonymous?",
    a: "Yes. Payment is used to verify identity and prevent fraud, but your specific vote choice is kept strictly private and never shared.",
  },
  {
    q: "Can I vote more than once?",
    a: "Yes - each additional vote requires a separate payment. This maintains fairness while giving passionate supporters a real voice.",
  },
  {
    q: "When are results announced?",
    a: "Live tallies are visible throughout the voting period. Final results are officially announced by organisers at the ceremony.",
  },
  {
    q: "What payment methods are accepted?",
    a: "MTN MoMo, Vodafone Cash, AirtelTigo Money, debit/credit cards, and other popular Ghanaian payment methods.",
  },
  {
    q: "How do I nominate someone?",
    a: "Visit our Nominations page, select the event and category, and complete the nominee profile. Our team reviews submissions before they go live.",
  },
];

export default function HowItWorksPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const statsRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const stepItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [stepsVisible, setStepsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  useEffect(() => {
    const el = stepsRef.current;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStepsVisible(true); },
      { threshold: 0.05 }
    );
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!stepsVisible) return;
    stepItemsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition =
          "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, i * 110 + 80);
    });
  }, [stepsVisible]);

  return (
    <main className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="feature-no pt-14 md:pt-16 pb-0">
        <div className="flex items-center justify-between mb-10 md:mb-12">
          <span className="text-xs font-mono tracking-[0.28em] text-muted-foreground">
            PLATFORM GUIDE
          </span>
          <span className="text-xs font-mono text-muted-foreground/35 hidden sm:block">
            5 STEPS
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-end pb-14 md:pb-20 border-b border-border/50"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-serif tracking-tight leading-[0.97]">
            Voting,
            <br />
            made{" "}
            <span className="text-primary/60 italic">clear.</span>
          </h1>

          <div className="space-y-6 lg:pb-2">
            <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed">
              Five steps from opening the app to watching your nominee&apos;s count
              rise. Secure, instant, and built for Ghanaian campuses.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="default" asChild>
                <Link href="/events">
                  Browse Events
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Link>
              </Button>
              <Button size="default" variant="outline" asChild>
                <Link href="/nominations">Nominate</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── THE PROCESS ──────────────────────────────────────────────── */}
      <section ref={stepsRef} className="feature-no py-0">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              ref={(el) => { stepItemsRef.current[i] = el; }}
              className="group relative grid grid-cols-1 lg:grid-cols-[120px_1fr_260px] border-b border-border/40 last:border-0 py-10 md:py-14 gap-6 lg:gap-0 hover:bg-muted/20 transition-colors duration-500 -mx-4 md:-mx-8 lg:-mx-16 px-4 md:px-8 lg:px-16"
            >
              {/* Large accent number */}
              <div className="flex items-start pt-1">
                <span className="text-6xl md:text-7xl font-light font-serif text-foreground/8 group-hover:text-foreground/15 transition-colors duration-500 leading-none select-none tabular-nums">
                  {step.number}
                </span>
              </div>

              {/* Main content */}
              <div className="lg:pr-12 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-500">
                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light font-serif tracking-tight">
                    {step.title}
                  </h2>
                </div>
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>

              {/* Note */}
              <div className="lg:border-l lg:border-border/40 lg:pl-8 self-center">
                <p className="text-sm font-light text-muted-foreground/50 leading-relaxed italic">
                  {step.note}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────── */}
      <section className="feature-no py-16 md:py-20 border-b border-border/30">
        <blockquote className="border-l-2 border-primary/40 pl-6 md:pl-10 max-w-3xl">
          <p className="text-2xl sm:text-3xl md:text-4xl font-light font-serif leading-snug text-foreground/75">
            10,000 votes cast.
            <br />
            Not a single one disputed.
          </p>
          <footer className="mt-5 text-xs font-mono tracking-[0.2em] text-muted-foreground">
            AIMS ACHIEVERS NETWORK - SINCE LAUNCH
          </footer>
        </blockquote>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-primary feature-no py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-primary-foreground/10">
          {[
            { value: 10000, suffix: "+", label: "Votes Cast", decimal: 0 },
            { value: 50, suffix: "+", label: "Events Powered", decimal: 0 },
            { value: 99.9, suffix: "%", label: "Uptime Record", decimal: 1 },
          ].map((stat, i) => (
            <div key={i} className="px-0 sm:px-10 py-8 sm:py-0 first:pl-0 last:pr-0">
              <div className="text-5xl md:text-6xl font-light tabular-nums text-secondary flex items-end">
                {statsVisible ? (
                  <NumberTicker value={stat.value} decimalPlaces={stat.decimal} className="tabular-nums" />
                ) : (
                  <span className="opacity-0">0</span>
                )}
                <span>{stat.suffix}</span>
              </div>
              <p className="mt-3 text-sm font-light text-primary-foreground/55 font-serif">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GUARANTEES ───────────────────────────────────────────────── */}
      <section className="feature-no py-16 md:py-24">
        <div className="mb-12">
          <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground block mb-3">
            OUR PROMISE
          </span>
          <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight max-w-sm">
            What you can
            <br />
            count on.
          </h2>
        </div>

        {/* Bento grid - first spans full width */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40">
          {[
            {
              icon: Shield,
              title: "Tamper-Proof",
              body: "Every vote is cryptographically sealed the moment it is cast. No manipulation, no double-counting - just a permanent, verified record.",
              wide: true,
            },
            {
              icon: Zap,
              title: "Instant Confirmation",
              body: "Your vote is confirmed in under a second. A clean receipt appears immediately - no refreshing, no uncertainty.",
              wide: false,
            },
            {
              icon: Trophy,
              title: "Fair Competition",
              body: "Transparent vote tallying means the best candidate wins - always. Every nominee starts at zero.",
              wide: false,
            },
            {
              icon: Users,
              title: "Built for Ghana",
              body: "Designed from the ground up for Ghanaian campus culture - local payment methods, local context, real community impact.",
              wide: false,
            },
          ].map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className={`group bg-background hover:bg-card p-8 sm:p-10 transition-colors duration-400 relative ${g.wide ? "sm:col-span-2" : ""}`}
              >
                <div className={g.wide ? "max-w-xl" : ""}>
                  <Icon
                    className="w-8 h-8 text-foreground/35 group-hover:text-foreground/70 transition-colors duration-400 mb-5"
                    strokeWidth={1.5}
                  />
                  <h3 className={`font-light font-serif tracking-wide mb-3 ${g.wide ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}`}>
                    {g.title}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    {g.body}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-transparent group-hover:border-border/30 transition-all duration-500" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-muted/20 feature-no py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-16">

          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight leading-tight">
              Questions
              <br />
              answered.
            </h2>
            <p className="text-sm font-light text-muted-foreground leading-relaxed">
              Can&apos;t find what you need? We&apos;re one message away.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/contact">
                Ask us directly
                <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border/50 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                >
                  <span className="text-base font-light font-serif leading-snug group-hover:text-primary transition-colors duration-300">
                    {faq.q}
                  </span>
                  <span className={`shrink-0 text-muted-foreground/50 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm font-light text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="feature-no py-16 md:py-24">
        <div className="relative bg-primary overflow-hidden px-8 sm:px-12 md:px-16 py-14 md:py-20">
          <span className="absolute -right-4 -bottom-8 text-[140px] md:text-[220px] font-serif font-bold text-primary-foreground/[0.06] select-none leading-none pointer-events-none">
            AAN
          </span>
          <div className="absolute top-0 left-0 right-0 h-px bg-secondary/30" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-primary-foreground/35">
                READY?
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-light font-serif text-primary-foreground tracking-tight leading-[1.03]">
                Your vote shapes
                <br />
                <span className="text-secondary italic">campus history.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/events">
                  View Events
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
                asChild
              >
                <Link href="/become-partner">Become a Partner</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
