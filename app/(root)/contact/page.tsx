"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowRight,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const subjects = [
  "Voting Support",
  "Nominations Help",
  "Event Enquiry",
  "Partnership",
  "Technical Issue",
  "Other",
];

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@aimsachievers.network",
    href: "mailto:hello@aimsachievers.network",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 (0) 24 000 0000",
    href: "tel:+233240000000",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Koforidua, Eastern Region, Ghana",
    href: null,
  },
];

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <main className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="feature-no pt-14 md:pt-16 pb-0">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-10 md:mb-14">
            <span className="text-xs font-mono tracking-[0.28em] text-muted-foreground">
              GET IN TOUCH
            </span>
            <span className="text-xs font-mono text-muted-foreground/40 hidden sm:block">
              RESPONSE WITHIN 48H
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-end pb-14 md:pb-20 border-b border-border/50"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-serif tracking-tight leading-[1.0]">
              Let&apos;s make
              <br />
              something{" "}
              <em className="not-italic text-primary/60">together.</em>
            </h1>
            <div className="space-y-6 lg:pb-2">
              <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed">
                Whether you have a question, need help with an event, or want to
                explore a partnership - we&apos;re here. A real person will
                respond.
              </p>
              <Button size="default" asChild>
                <a href="#form">
                  Send a Message
                  <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT DETAILS ───────────────────────────────────── */}
      <section className="feature-no py-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="py-8 sm:px-8 first:pl-0 last:pr-0 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-md bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors duration-300">
                      <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono tracking-[0.22em] text-muted-foreground/50 uppercase mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-light font-serif hover:text-primary transition-colors duration-300 leading-snug"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-light font-serif text-foreground/80 leading-snug">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FORM + EXTRA ─────────────────────────────────────── */}
      <section id="form" className="feature-no py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 md:gap-16">

            {/* Left column */}
            <div className="space-y-10">
              <div>
                <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground block mb-3">
                  QUICK LINKS
                </span>
                <div className="space-y-0 divide-y divide-border/40">
                  {[
                    { label: "Voting Support", href: "/how-it-works" },
                    { label: "Partnership Enquiries", href: "/become-partner" },
                    { label: "Nominations Help", href: "/nominations" },
                    { label: "Event Information", href: "/events" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="group flex items-center justify-between py-4 text-sm font-light text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div>
                <p className="text-[10px] font-mono tracking-[0.22em] text-muted-foreground/50 uppercase mb-4">
                  Follow Us
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, label: "Instagram", href: "#" },
                    { icon: Twitter, label: "Twitter / X", href: "#" },
                    { icon: Linkedin, label: "LinkedIn", href: "#" },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="w-9 h-9 border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Office hours */}
              <div className="border-t border-border/40 pt-8">
                <p className="text-[10px] font-mono tracking-[0.22em] text-muted-foreground/50 uppercase mb-3">
                  Office Hours
                </p>
                <div className="space-y-1.5 text-sm font-light text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span>8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground/50">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm"
            >
              <h3 className="text-2xl font-serif font-light mb-8">
                Send a Message
              </h3>

              <form
                ref={formRef}
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Kofi"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Mensah"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {subjects.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSubject(s)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-sm transition-all duration-200 ${
                          selectedSubject === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group">
                  <Send className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  Send Message
                </Button>

                <p className="text-center text-xs text-muted-foreground/50 pt-1">
                  We reply within 48 hours. No spam, ever.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAP / LOCATION STRIP ─────────────────────────────── */}
      <section className="feature-no pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-primary overflow-hidden px-8 sm:px-12 md:px-16 py-14 md:py-20">
            <span className="absolute -right-4 -bottom-8 text-[140px] md:text-[220px] font-serif font-bold text-primary-foreground/[0.06] select-none leading-none pointer-events-none">
              AAN
            </span>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <span className="text-xs font-mono tracking-[0.25em] text-primary-foreground/40">
                  BASED IN GHANA
                </span>
                <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-light font-serif text-primary-foreground tracking-tight leading-[1.05]">
                  Koforidua,
                  <br />
                  <span className="text-secondary">Eastern Region.</span>
                </h2>
                <p className="mt-4 text-sm font-light text-primary-foreground/55 max-w-sm leading-relaxed">
                  Serving campuses across Ghana - from Koforidua to Accra,
                  Kumasi and beyond.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <a href="mailto:hello@aimsachievers.network">
                    Email Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
                  asChild
                >
                  <a href="tel:+233240000000">Call Us</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
