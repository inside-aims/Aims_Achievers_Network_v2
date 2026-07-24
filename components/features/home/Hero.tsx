"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StartEventButton from "@/components/shared/start-event-button";
import { Award, Calendar, ShieldCheck, Ticket, Vote } from "lucide-react";

const trustBadges = [
  { icon: ShieldCheck, label: "Bank-grade security" },
  { icon: Vote, label: "Real-time results" },
  { icon: Ticket, label: "Instant e-tickets" },
  { icon: Calendar, label: "Live all year round" },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90svh] bg-primary text-primary-foreground overflow-hidden flex flex-col">
      {/* Grid texture — consistent with the rest of the page's dark sections */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      <div className="relative z-10 feature-no flex-1 flex flex-col items-center justify-center text-center py-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-xs font-mono tracking-[0.25em] uppercase text-secondary mb-8"
        >
          Ghana&apos;s Awards &amp; Ticketing Platform
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-light font-serif tracking-tight leading-[0.95] max-w-4xl"
        >
          Cast your vote.
          <br />
          <span className="text-secondary italic">Grab your ticket.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="mt-8 text-base md:text-lg font-light text-primary-foreground/50 max-w-lg leading-relaxed"
        >
          One platform for award-show voting and event ticketing — secure,
          real-time, and built for Ghana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" variant="secondary" asChild>
            <Link href="/events">
              Explore Events
            </Link>
          </Button>
          <StartEventButton
            size="lg"
            className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
          >
            <Award className="mr-1.5 w-4 h-4" />
            Start an Event
          </StartEventButton>
        </motion.div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="relative z-10 border-t border-primary-foreground/10 shrink-0"
      >
        <div className="feature-no py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {trustBadges.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-2 text-[10px] font-mono tracking-[0.18em] text-primary-foreground/35 uppercase shrink-0">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {label}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
