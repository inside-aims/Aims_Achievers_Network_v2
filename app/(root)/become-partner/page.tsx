"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Building2,
  Trophy,
  Users,
  TrendingUp,
  Globe,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Send,
  Mail,
  Phone,
  Handshake,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NumberTicker } from "@/components/ui/number-ticker";

const benefits = [
  {
    icon: Users,
    stat: "25K+",
    title: "Students Reached",
    body: "A highly active audience across multiple Ghanaian institutions - passionate, engaged, and influential.",
  },
  {
    icon: Globe,
    stat: "360°",
    title: "Brand Visibility",
    body: "Platform, social channels, venue backdrops, print materials - your brand is everywhere we are.",
  },
  {
    icon: TrendingUp,
    stat: "Data",
    title: "Measurable Impact",
    body: "Post-campaign analytics covering impressions, engagement, and audience demographics - no guesswork.",
  },
  {
    icon: Megaphone,
    stat: "Gen-Z",
    title: "Authentic Reach",
    body: "We craft brand stories that resonate - not just logos on a banner, but a genuine connection to campus life.",
  },
];

const tiers = [
  {
    name: "Media Partner",
    icon: Camera,
    featured: false,
    tagline: "Exclusive coverage rights",
    description:
      "Gain exclusive content access and coverage rights across our campus events. Your brand becomes the voice of campus achievement.",
    perks: [
      "Exclusive event media credentials",
      "Logo placement on all event materials",
      "Social media co-features",
      "Post-event highlight package",
    ],
  },
  {
    name: "Event Sponsor",
    icon: Trophy,
    featured: true,
    tagline: "Your brand at centre stage",
    description:
      "The most prominent partnership tier. Your brand powers the event - from the stage backdrop to the MC's first words.",
    perks: [
      "Title sponsorship naming rights",
      "Stage banner & backdrop placement",
      "MC shout-outs throughout event",
      "Pre-event promotional campaign",
      "VIP seating & tickets",
      "Full post-event analytics report",
    ],
  },
  {
    name: "Community Partner",
    icon: Building2,
    featured: false,
    tagline: "Embedded in campus culture",
    description:
      "Align your institution or brand with Ghana's most engaged student ecosystems through consistent, meaningful presence.",
    perks: [
      "Brand presence on voting platform",
      "Campus outreach mentions",
      "Event programme feature",
      "Monthly newsletter inclusion",
    ],
  },
];

const partnerTypes = [
  "Title Sponsor",
  "Award Category Sponsor",
  "Media Partner",
  "Community Partner",
  "Technology Partner",
  "Food & Beverage",
  "Fashion & Lifestyle",
  "Other",
];

export default function BecomePartnerPage() {
  const [statsVisible, setStatsVisible] = useState(false);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const statsRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const benefitCardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    const el = benefitsRef.current;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setBenefitsVisible(true); },
      { threshold: 0.1 }
    );
    if (el) obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!benefitsVisible) return;
    benefitCardsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition =
          "opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1), transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, i * 90 + 80);
    });
  }, [benefitsVisible]);

  return (
    <main className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="feature-no pt-14 md:pt-16 pb-0">
        <div className="max-w-7xl mx-auto">

          {/* Top label row */}
          <div className="flex items-center justify-between mb-10 md:mb-14">
            <span className="text-xs font-mono tracking-[0.28em] text-muted-foreground">
              PARTNERSHIP PROGRAMME
            </span>
            <span className="text-xs font-mono text-muted-foreground/40 hidden sm:block">
              EST. AIMS ACHIEVERS NETWORK
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-20 items-end pb-14 md:pb-20 border-b border-border/50"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light font-serif tracking-tight leading-[1.0]">
              Grow alongside
              <br />
              <em className="not-italic text-primary/60">campus culture.</em>
            </h1>

            <div className="space-y-6 lg:pb-2">
              <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed">
                We partner with brands, media houses, and institutions that
                believe in student excellence. Not just logos - real stories,
                real communities, real impact.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="default" className="flex-1" asChild>
                  <a href="#apply">
                    Apply to Partner
                    <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button size="default" variant="outline" className="flex-1" asChild>
                  <Link href="/contact">Talk First</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Partner type pills - visual interest below hero */}
          <div className="py-6 flex flex-wrap gap-2 border-b border-border/40">
            {[
              "Title Sponsor",
              "Media Partner",
              "Category Sponsor",
              "Community Partner",
              "Technology Partner",
            ].map((t) => (
              <span
                key={t}
                className="text-xs font-mono tracking-wide border border-border/50 text-muted-foreground/60 px-3 py-1 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="bg-primary feature-no py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/10">
            {[
              { value: 25000, suffix: "+", label: "Students Reached", decimal: 0 },
              { value: 50, suffix: "+", label: "Events Hosted", decimal: 0 },
              { value: 12, suffix: "+", label: "Campuses", decimal: 0 },
              { value: 99, suffix: "%", label: "Partner Satisfaction", decimal: 0 },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-6 md:px-10 py-6 md:py-0 first:pl-0 last:pr-0"
              >
                <div className="text-4xl md:text-5xl font-light tabular-nums text-secondary flex items-end">
                  {statsVisible ? (
                    <NumberTicker
                      value={stat.value}
                      decimalPlaces={stat.decimal}
                      className="tabular-nums"
                    />
                  ) : (
                    <span className="opacity-0">0</span>
                  )}
                  <span>{stat.suffix}</span>
                </div>
                <p className="mt-2 text-sm font-light text-primary-foreground/55 font-serif">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PARTNER ──────────────────────────────────────────────── */}
      <section ref={benefitsRef} className="feature-no py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 mb-12">
            <div>
              <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground block mb-3">
                WHY PARTNER WITH US
              </span>
              <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight leading-tight">
                Where brands
                <br />
                meet ambition.
              </h2>
            </div>
            <p className="text-base font-light text-muted-foreground leading-relaxed lg:self-end max-w-prose">
              Ghanaian campuses are vibrant ecosystems of future leaders,
              creators, and consumers. AAN gives your brand authentic access to
              this demographic through events that genuinely matter to them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  ref={(el) => { benefitCardsRef.current[i] = el; }}
                  className="group bg-background hover:bg-card p-8 sm:p-10 transition-colors duration-400 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <Icon
                      className="w-8 h-8 text-foreground/35 group-hover:text-foreground/70 transition-colors duration-400"
                      strokeWidth={1.5}
                    />
                    <span className="text-4xl font-light font-serif text-foreground/10 group-hover:text-foreground/20 transition-colors duration-400 leading-none">
                      {b.stat}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-light font-serif tracking-wide mb-3">
                    {b.title}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed">
                    {b.body}
                  </p>
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-border/0 group-hover:border-border/30 transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP TIERS ────────────────────────────────────────── */}
      <section className="bg-card/30 feature-no py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center gap-6 mb-12">
            <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground shrink-0">
              TIERS
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="space-y-0">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <div
                  key={i}
                  className={`group relative border-b border-border/40 last:border-0 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-6 lg:gap-12 transition-colors duration-400 ${
                    tier.featured ? "bg-primary/[0.02]" : "hover:bg-card/60"
                  }`}
                >
                  {/* Featured top accent */}
                  {tier.featured && (
                    <div className="absolute top-0 left-0 right-0 h-px bg-primary/50" />
                  )}

                  {/* Tier identity */}
                  <div className="flex lg:flex-col items-start gap-4 lg:gap-3">
                    <div
                      className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                        tier.featured
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted border border-border/60"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${tier.featured ? "text-primary" : "text-foreground/50"}`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-light font-serif tracking-wide">
                          {tier.name}
                        </h3>
                        {tier.featured && (
                          <span className="text-[10px] font-mono tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-sm">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground/50 tracking-wide mt-0.5">
                        {tier.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-sm font-light text-muted-foreground leading-relaxed">
                      {tier.description}
                    </p>
                    <a
                      href="#apply"
                      className={`inline-flex items-center text-sm font-light gap-2 transition-all duration-300 ${
                        tier.featured
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Apply for this tier
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Perks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {tier.perks.map((perk, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm font-light">
                        <CheckCircle
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            tier.featured ? "text-primary/60" : "text-foreground/30"
                          }`}
                        />
                        <span className="text-muted-foreground">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── APPLICATION FORM ─────────────────────────────────────────── */}
      <section id="apply" className="feature-no py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 md:gap-16">

            {/* Left column */}
            <div className="space-y-10">
              <div>
                <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground block mb-3">
                  APPLY NOW
                </span>
                <h2 className="text-3xl sm:text-4xl font-light font-serif tracking-tight leading-tight">
                  Start the
                  <br />
                  conversation.
                </h2>
                <p className="mt-5 text-sm font-light text-muted-foreground leading-relaxed">
                  Fill in your details and our partnerships team will reach out
                  within 48 hours with a tailored proposal.
                </p>
              </div>

              <div className="space-y-5">
                <a
                  href="mailto:partners@aimsachievers.network"
                  className="flex items-center gap-4 group"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-wider text-muted-foreground/50 uppercase mb-0.5">
                      Email
                    </div>
                    <span className="text-sm font-light group-hover:text-primary transition-colors duration-300">
                      partners@aimsachievers.network
                    </span>
                  </div>
                </a>

                <a href="tel:+233240000000" className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-300">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-wider text-muted-foreground/50 uppercase mb-0.5">
                      Phone
                    </div>
                    <span className="text-sm font-light group-hover:text-primary transition-colors duration-300">
                      +233 (0) 24 000 0000
                    </span>
                  </div>
                </a>
              </div>

              <div className="border-t border-border/40 pt-8 space-y-3">
                <div className="flex items-center gap-2.5 text-sm font-light text-muted-foreground">
                  <Handshake className="w-4 h-4 text-muted-foreground/40" />
                  Trusted by brands across Ghana
                </div>
                <div className="flex items-center gap-2.5 text-sm font-light text-muted-foreground">
                  <Star className="w-4 h-4 text-secondary/70" />
                  No commitment required to enquire
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
                Partnership Enquiry
              </h3>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="orgName" className="text-sm font-medium">
                      Organisation
                    </label>
                    <input
                      id="orgName"
                      type="text"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Acme Corp Ltd."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contactName" className="text-sm font-medium">
                      Your Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Jane Mensah"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="partnerEmail" className="text-sm font-medium">
                      Business Email
                    </label>
                    <input
                      id="partnerEmail"
                      type="email"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="partnerPhone" className="text-sm font-medium">
                      Phone
                    </label>
                    <input
                      id="partnerPhone"
                      type="tel"
                      className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="+233 24 000 0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Partnership Type</label>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {partnerTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-sm transition-all duration-200 ${
                          selectedType === type
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="budget" className="text-sm font-medium">
                    Estimated Budget (GHS)
                  </label>
                  <select
                    id="budget"
                    defaultValue=""
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    <option>Under GHS 1,000</option>
                    <option>GHS 1,000 – 5,000</option>
                    <option>GHS 5,000 – 15,000</option>
                    <option>GHS 15,000 – 50,000</option>
                    <option>Over GHS 50,000</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="goals" className="text-sm font-medium">
                    Your Goals
                  </label>
                  <textarea
                    id="goals"
                    rows={4}
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder="What are you hoping to achieve? Any specific events in mind?"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full group">
                  <Send className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  Submit Enquiry
                </Button>

                <p className="text-center text-xs text-muted-foreground/50 pt-1">
                  We respond within 48 hours. No spam, ever.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
      <section className="feature-no pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-primary overflow-hidden px-8 sm:px-12 md:px-16 py-14 md:py-20">
            <span className="absolute -right-4 -bottom-8 text-[140px] md:text-[220px] font-serif font-bold text-primary-foreground/[0.06] select-none leading-none pointer-events-none">
              AAN
            </span>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center">
              <div>
                <span className="text-xs font-mono tracking-[0.25em] text-primary-foreground/40">
                  PARTNER WITH US
                </span>
                <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-light font-serif text-primary-foreground tracking-tight leading-[1.05]">
                  Your brand deserves
                  <br />
                  <span className="text-secondary">to be celebrated.</span>
                </h2>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <a href="#apply">
                    Apply Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="w-full bg-transparent border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shadow-none"
                  asChild
                >
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
