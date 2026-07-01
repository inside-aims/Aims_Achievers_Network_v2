"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Award,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  Vote,
} from "lucide-react";

const trustBadges = [
  { icon: ShieldCheck, label: "Bank-grade security" },
  { icon: Vote, label: "Real-time results" },
  { icon: Ticket, label: "Instant e-tickets" },
  { icon: Smartphone, label: "Works on any device" },
];

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100svh] bg-primary text-primary-foreground overflow-hidden flex flex-col">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          fill
          priority
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80"
          alt=""
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/95 to-primary" />
      </div>

      {/* Spotlight glow */}
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80%] aspect-square rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 feature-no flex-1 flex flex-col items-center justify-center text-center py-28 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="inline-flex items-center gap-2 border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-secondary" strokeWidth={1.75} />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-primary-foreground/60">
            Ghana&apos;s Awards &amp; Ticketing Platform
          </span>
        </motion.div>

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
          One platform for award-show voting and event ticketing — secure, real-time,
          and built for Ghana&apos;s campuses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" variant="secondary" asChild>
            <Link href="/events">
              <Vote className="mr-1.5 w-4 h-4" />
              Vote Now
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
            asChild
          >
            <Link href="/events">
              <Ticket className="mr-1.5 w-4 h-4" />
              Get Tickets
            </Link>
          </Button>
          <Button
            size="lg"
            className="bg-transparent border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
            asChild
          >
            <Link href="/become-partner">
              <Award className="mr-1.5 w-4 h-4" />
              Start an Event
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
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
