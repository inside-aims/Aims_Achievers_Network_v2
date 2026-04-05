"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[54px_54px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-32 pb-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24"
        >
          {/* Left Column: Contact Info */}
          <div className="space-y-12">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="text-xs font-mono tracking-[0.25em] text-muted-foreground uppercase">
                Get In Touch
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light leading-tight">
                Let&apos;s make something <span className="italic text-primary/80">extraordinary</span> together.
              </h1>
              <p className="text-muted-foreground leading-relaxed max-w-sm pt-4">
                Whether you have a question about our platform, need help hosting an event, or just want to explore a partnership, we&apos;re here to talk.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8 pt-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm tracking-widest font-mono text-muted-foreground uppercase mb-1">Email Us</h3>
                  <a href="mailto:hello@aimsachievers.network" className="text-lg font-light hover:text-primary transition-colors">
                    hello@aimsachievers.network
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm tracking-widest font-mono text-muted-foreground uppercase mb-1">Call Us</h3>
                  <a href="tel:+233240000000" className="text-lg font-light hover:text-primary transition-colors">
                    +233 (0) 24 000 0000
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm tracking-widest font-mono text-muted-foreground uppercase mb-1">Location</h3>
                  <p className="text-lg font-light">
                    Koforidua, Eastern Region<br />
                    Ghana
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div variants={itemVariants} className="bg-card w-full rounded-2xl border border-border p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-serif">Send a Message</h2>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="john@university.edu"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                  id="subject"
                  type="text"
                  className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-background border border-input rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Tell us a little bit about your event..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full group">
                <Send className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
