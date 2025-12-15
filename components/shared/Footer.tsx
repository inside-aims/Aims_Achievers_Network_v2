"use client";

import React from "react";
import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";

const AimsFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border">
      {/* Primary Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-16">
          
          {/* Column 1 - Brand & Mission */}
          <div className="space-y-4 lg:col-span-1">
            <div className="text-xl font-serif tracking-wide text-foreground">
              AIMS ACHIEVERS NETWORK
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              Fostering excellence through meaningful partnerships and unforgettable campus experiences across Ghanaian institutions.
            </p>
          </div>

          {/* Column 2 - Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase text-foreground/80">
              Platform
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="/events" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Events
                </a>
              </li>
              <li>
                <a 
                  href="/how-it-works" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a 
                  href="/partners" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Partners
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Community & Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase text-foreground/80">
              Community & Resources
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="/become-partner" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Become a Partner
                </a>
              </li>
              <li>
                <a 
                  href="/host-event" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Host an Event
                </a>
              </li>
              <li>
                <a 
                  href="/ambassadors" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Student Ambassadors
                </a>
              </li>
              <li>
                <a 
                  href="/gallery" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  Media / Gallery
                </a>
              </li>
              <li>
                <a 
                  href="/faqs" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium tracking-widest uppercase text-foreground/80">
              Connect
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:hello@aimsachievers.network" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>hello@aimsachievers.network</span>
              </a>
              
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>

              <p className="text-xs text-muted-foreground/70 pt-2 leading-relaxed">
                Trusted by institutions across Ghana
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Footer */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/70">
            <div>
              © {currentYear} AimsAchieversNetwork. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="/privacy" 
                className="hover:text-foreground transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="hover:text-foreground transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a 
                href="/cookies" 
                className="hover:text-foreground transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AimsFooter;