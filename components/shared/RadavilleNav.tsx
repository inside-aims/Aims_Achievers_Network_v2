"use client";

import React, { useState, useEffect, useRef } from "react";
import { SquareMenu, X } from "lucide-react";

const navItems = [
  { number: "01", title: "Home", href: "/" },
  { number: "02", title: "About", href: "/about" },
  { number: "03", title: "Events", href: "/events" },
  { number: "04", title: "Contact", href: "/contact" },
];

const RadavilleNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const menuItemsRef = useRef([]);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isMenuClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isMenuClosing]);

  // Menu animations
  useEffect(() => {
    if (isMenuOpen && !isMenuClosing) {
      // Animate menu background - entrance
      if (menuRef.current) {
        menuRef.current.style.opacity = "0";
        menuRef.current.style.transform = "scale(0.95)";

        requestAnimationFrame(() => {
          menuRef.current.style.transition =
            "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
          menuRef.current.style.opacity = "1";
          menuRef.current.style.transform = "scale(1)";
        });
      }

      // Stagger menu items - entrance
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          item.style.opacity = "0";
          item.style.transform = "translateY(40px)";

          setTimeout(() => {
            item.style.transition =
              "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, index * 100 + 250);
        }
      });
    }
  }, [isMenuOpen, isMenuClosing]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close animation
      setIsMenuClosing(true);

      // Animate items out in reverse
      menuItemsRef.current.forEach((item, index) => {
        if (item) {
          setTimeout(() => {
            item.style.transition =
              "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
            item.style.opacity = "0";
            item.style.transform = "translateY(-30px)";
          }, (menuItemsRef.current.length - 1 - index) * 80);
        }
      });

      // Animate background out
      setTimeout(() => {
        if (menuRef.current) {
          menuRef.current.style.transition =
            "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
          menuRef.current.style.opacity = "0";
          menuRef.current.style.transform = "scale(1.05)";
        }
      }, menuItemsRef.current.length * 80 + 100);

      // Remove menu from DOM after animation
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
      }, menuItemsRef.current.length * 80 + 700);
    } else {
      setIsMenuOpen(true);
    }
  };

  return (
    <>
      {/* Header - Transparent when closed, glassmorphism on scroll */}
      <header 
        className={`sticky top-0 left-0 right-0 z-50 text-foreground transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/70 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
          <div className="text-xs sm:text-sm tracking-widest font-light font-serif">
            AIMS ACHIEVERS NETWORK
          </div>

          <button
            onClick={toggleMenu}
            className="group relative text-xs sm:text-sm tracking-widest font-light hover:opacity-70 transition-opacity duration-300"
            aria-label={isMenuOpen || isMenuClosing ? "Close menu" : "Open menu"}
          >
            {isMenuOpen || isMenuClosing ? <X size={20} /> : <SquareMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Full-screen Menu Overlay - 30% Secondary Color (Yellow/Orange) */}
      {(isMenuOpen || isMenuClosing) && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-background text-secondary-foreground z-40 flex items-center justify-center p-4 sm:p-6 md:p-8"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          {/* Container for responsive layout */}
          <div className="relative w-full h-full max-w-6xl mx-auto">
            
            {/* Bigger Navigation Items - Using Primary Color (10% accent) */}
            <nav className="absolute bottom-10 left-4 sm:bottom-10 sm:left-6 md:bottom-10 md:left-8 lg:left-8 lg:top-1/2 lg:-translate-y-1/2 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-2">
              {navItems.map((item, index) => (
                <div
                  key={item.number}
                  ref={(el) => {
                    menuItemsRef.current[index] = el;
                  }}
                  className="group cursor-pointer"
                >
                  <a
                    href={item.href}
                    className="flex items-baseline gap-4 sm:gap-6 md:gap-8 lg:gap-10"
                  >
                    <span className="text-xs sm:text-sm md:text-base text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300 shrink-0 font-mono">
                      {item.number}
                    </span>
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-wide group-hover:tracking-wider transition-all duration-500 leading-tight font-serif text-foreground hover:text-primary">
                      {item.title}
                    </span>
                  </a>
                </div>
              ))}
            </nav>

            {/* Smaller Navigation Links - 10% Accent Details */}
            <div className="absolute top-44 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:bottom-8 lg:right-8 lg:top-auto">
              <div className="flex flex-col gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground">
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-accent-foreground">01 Services</p>
                  <p className="font-light leading-relaxed font-serif">
                    Seamless Voting · Ticketing · Nominations
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-primary">02 Location</p>
                  <p className="font-light font-serif">Koforidua, Ghana</p>
                </div>
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-primary">03 Social</p>
                  <p className="font-light font-serif">
                    Instagram · X · WhatsApp · LinkedIn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RadavilleNav;