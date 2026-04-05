"use client";

import React, { useState, useEffect, useRef } from "react";
import { SquareMenu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const pathname = usePathname();

  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const decorativeLineRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isMenuClosing ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isMenuClosing]);

  useEffect(() => {
    if (!isMenuOpen || isMenuClosing) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (menuRef.current) {
      menuRef.current.style.opacity = "0";
      menuRef.current.style.transform = "translateY(-8px)";
      requestAnimationFrame(() => {
        if (!menuRef.current) return;
        menuRef.current.style.transition =
          "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
        menuRef.current.style.opacity = "1";
        menuRef.current.style.transform = "translateY(0)";
      });
    }

    if (decorativeLineRef.current) {
      decorativeLineRef.current.style.width = "0";
      timeouts.push(
        setTimeout(() => {
          if (!decorativeLineRef.current) return;
          decorativeLineRef.current.style.transition =
            "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)";
          decorativeLineRef.current.style.width = "100%";
        }, 200)
      );
    }

    menuItemsRef.current.forEach((item, index) => {
      if (!item) return;
      item.style.opacity = "0";
      item.style.transform = "translateX(-24px)";
      timeouts.push(
        setTimeout(() => {
          if (!item) return;
          item.style.transition =
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          item.style.opacity = "1";
          item.style.transform = "translateX(0)";
        }, index * 90 + 180)
      );
    });

    if (sidebarRef.current) {
      sidebarRef.current.style.opacity = "0";
      sidebarRef.current.style.transform = "translateY(16px)";
      timeouts.push(
        setTimeout(() => {
          if (!sidebarRef.current) return;
          sidebarRef.current.style.transition =
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          sidebarRef.current.style.opacity = "1";
          sidebarRef.current.style.transform = "translateY(0)";
        }, navItems.length * 90 + 200)
      );
    }

    if (bottomRowRef.current) {
      bottomRowRef.current.style.opacity = "0";
      timeouts.push(
        setTimeout(() => {
          if (!bottomRowRef.current) return;
          bottomRowRef.current.style.transition = "opacity 0.5s ease";
          bottomRowRef.current.style.opacity = "1";
        }, navItems.length * 90 + 350)
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, [isMenuOpen, isMenuClosing]);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      return;
    }

    setIsMenuClosing(true);
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    menuItemsRef.current.forEach((item, index) => {
      if (!item) return;
      timeouts.push(
        setTimeout(() => {
          if (!item) return;
          item.style.transition =
            "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
          item.style.opacity = "0";
          item.style.transform = "translateX(-16px)";
        }, (menuItemsRef.current.length - 1 - index) * 60)
      );
    });

    if (decorativeLineRef.current) {
      decorativeLineRef.current.style.transition =
        "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      decorativeLineRef.current.style.width = "0";
    }

    if (sidebarRef.current) {
      sidebarRef.current.style.transition =
        "opacity 0.3s ease, transform 0.3s ease";
      sidebarRef.current.style.opacity = "0";
      sidebarRef.current.style.transform = "translateY(8px)";
    }

    if (bottomRowRef.current) {
      bottomRowRef.current.style.transition = "opacity 0.2s ease";
      bottomRowRef.current.style.opacity = "0";
    }

    timeouts.push(
      setTimeout(() => {
        if (!menuRef.current) return;
        menuRef.current.style.transition =
          "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        menuRef.current.style.opacity = "0";
        menuRef.current.style.transform = "translateY(-6px)";
      }, menuItemsRef.current.length * 60 + 80)
    );

    timeouts.push(
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
      }, menuItemsRef.current.length * 60 + 550)
    );
  };

  const menuActive = isMenuOpen || isMenuClosing;

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          menuActive
            ? "text-primary-foreground"
            : isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/40 text-foreground"
            : "bg-transparent text-foreground"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 h-14 sm:h-16 md:h-20">
          <Link
            href="/"
            className="text-xs sm:text-sm tracking-widest font-light font-serif hover:opacity-60 transition-opacity duration-300"
          >
            AIMS ACHIEVERS NETWORK
          </Link>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={toggleMenu}
            aria-label={menuActive ? "Close menu" : "Open menu"}
            className="rounded-sm hover:bg-transparent hover:opacity-60 transition-opacity duration-300"
          >
            {menuActive ? <X size={20} /> : <SquareMenu size={20} />}
          </Button>
        </div>
      </header>

      {menuActive && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-primary z-40 flex flex-col"
        >
          {/* Subtle grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

          {/* AAN watermark */}
          <span className="absolute right-0 bottom-0 text-[35vw] sm:text-[28vw] font-serif font-bold leading-none tracking-tighter select-none text-primary-foreground/[0.04] pointer-events-none">
            AAN
          </span>

          {/* Spacer to clear the sticky header */}
          <div className="h-14 sm:h-16 md:h-20 shrink-0 px-4 sm:px-6 md:px-8 flex items-end pb-0">
            <div
              ref={decorativeLineRef}
              className="h-px bg-primary-foreground/15"
              style={{ width: 0 }}
            />
          </div>

          {/* Main content — fills remaining space */}
          <div className="flex-1 flex flex-col lg:flex-row px-4 sm:px-6 md:px-8 pt-10 sm:pt-12 lg:pt-0 lg:items-center lg:justify-between overflow-hidden gap-10 lg:gap-0">
            {/* Navigation links */}
            <nav className="space-y-2 sm:space-y-3">
              {navItems.map((item, index) => (
                <div
                  key={item.number}
                  ref={(el) => {
                    menuItemsRef.current[index] = el;
                  }}
                  className="group cursor-pointer"
                >
                  <Link
                    href={item.href}
                    onClick={toggleMenu}
                    className="flex items-baseline gap-3 sm:gap-5 md:gap-6"
                  >
                    <span
                      className={`text-[10px] sm:text-xs shrink-0 font-mono transition-all duration-300 ${
                        pathname === item.href
                          ? "text-secondary opacity-100"
                          : "text-primary-foreground/30 group-hover:text-secondary group-hover:opacity-100"
                      }`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight font-serif transition-all duration-400 text-primary-foreground ${
                        pathname === item.href
                          ? "opacity-100"
                          : "opacity-50 group-hover:opacity-100"
                      }`}
                    >
                      {item.title}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px bg-secondary transition-all duration-500 ease-out ${
                          pathname === item.href
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Sidebar info panel */}
            <div
              ref={sidebarRef}
              className="lg:self-end"
            >
              <div className="flex flex-col gap-4">
                {[
                  { label: "SERVICES", value: "Voting · Ticketing · Nominations" },
                  { label: "LOCATION", value: "Koforidua, Ghana" },
                  { label: "SOCIAL", value: "Instagram · X · LinkedIn" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] tracking-[0.22em] font-mono text-primary-foreground/30 uppercase mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-xs font-mono text-primary-foreground/60">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div
            ref={bottomRowRef}
            className="shrink-0 px-4 sm:px-6 md:px-8 py-5 border-t border-primary-foreground/10 flex items-center justify-between"
          >
            <span className="text-[10px] font-mono tracking-widest text-primary-foreground/25">
              © {new Date().getFullYear()} AIMS ACHIEVERS NETWORK
            </span>
            <span className="text-[10px] font-mono tracking-widest text-primary-foreground/25">
              ONLINE VOTING PLATFORM
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default RadavilleNav;
