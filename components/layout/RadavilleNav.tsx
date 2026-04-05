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
      menuRef.current.style.transform = "scale(0.98)";
      requestAnimationFrame(() => {
        if (!menuRef.current) return;
        menuRef.current.style.transition =
          "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        menuRef.current.style.opacity = "1";
        menuRef.current.style.transform = "scale(1)";
      });
    }

    if (decorativeLineRef.current) {
      decorativeLineRef.current.style.width = "0";
      timeouts.push(
        setTimeout(() => {
          if (!decorativeLineRef.current) return;
          decorativeLineRef.current.style.transition =
            "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
          decorativeLineRef.current.style.width = "100%";
        }, 300)
      );
    }

    if (sidebarRef.current) {
      sidebarRef.current.style.opacity = "0";
      sidebarRef.current.style.transform = "translateX(20px)";
      timeouts.push(
        setTimeout(() => {
          if (!sidebarRef.current) return;
          sidebarRef.current.style.transition =
            "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
          sidebarRef.current.style.opacity = "1";
          sidebarRef.current.style.transform = "translateX(0)";
        }, 400)
      );
    }

    menuItemsRef.current.forEach((item, index) => {
      if (!item) return;
      item.style.opacity = "0";
      item.style.transform = "translateY(40px)";
      timeouts.push(
        setTimeout(() => {
          if (!item) return;
          item.style.transition =
            "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, index * 100 + 250)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isMenuOpen, isMenuClosing]);

  const toggleMenu = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
      return;
    }

    setIsMenuClosing(true);
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (sidebarRef.current) {
      sidebarRef.current.style.transition =
        "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      sidebarRef.current.style.opacity = "0";
      sidebarRef.current.style.transform = "translateX(20px)";
    }

    if (decorativeLineRef.current) {
      decorativeLineRef.current.style.transition =
        "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      decorativeLineRef.current.style.width = "0";
    }

    menuItemsRef.current.forEach((item, index) => {
      if (!item) return;
      timeouts.push(
        setTimeout(() => {
          if (!item) return;
          item.style.transition =
            "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
          item.style.opacity = "0";
          item.style.transform = "translateY(-30px)";
        }, (menuItemsRef.current.length - 1 - index) * 80)
      );
    });

    timeouts.push(
      setTimeout(() => {
        if (!menuRef.current) return;
        menuRef.current.style.transition =
          "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        menuRef.current.style.opacity = "0";
        menuRef.current.style.transform = "scale(1.02)";
      }, menuItemsRef.current.length * 80 + 100)
    );

    timeouts.push(
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsMenuClosing(false);
      }, menuItemsRef.current.length * 80 + 700)
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
            ? "bg-background/70 backdrop-blur-md shadow-sm text-foreground"
            : "bg-transparent text-foreground"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 md:p-8">
          <Link
            href="/"
            className="text-xs sm:text-sm tracking-widest font-light font-serif hover:opacity-70 transition-opacity duration-300"
          >
            AIMS ACHIEVERS NETWORK
          </Link>
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={toggleMenu}
            aria-label={menuActive ? "Close menu" : "Open menu"}
            className="rounded-sm hover:bg-transparent hover:opacity-70 transition-opacity duration-300"
          >
            {menuActive ? <X size={22} /> : <SquareMenu size={22} />}
          </Button>
        </div>
      </header>

      {menuActive && (
        <div
          ref={menuRef}
          className="fixed inset-0 bg-primary z-40 p-4 sm:p-6 md:p-8"
        >
          {/* Subtle grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[54px_54px] pointer-events-none" />

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-8 pointer-events-none overflow-hidden">
            <span className="text-[20vw] font-serif font-light leading-none tracking-tighter select-none text-primary-foreground/[0.04]">
              AAN
            </span>
          </div>

          {/* Decorative rule — sweeps in below header */}
          <div className="absolute top-[3.25rem] sm:top-[4.25rem] md:top-[5.25rem] left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 overflow-hidden">
            <div
              ref={decorativeLineRef}
              className="h-px bg-primary-foreground/20"
              style={{ width: 0 }}
            />
          </div>

          <div className="relative w-full h-full max-w-6xl mx-auto">
            {/* Navigation items */}
            <nav className="absolute bottom-10 left-0 sm:bottom-10 lg:left-0 lg:top-1/2 lg:-translate-y-1/2 space-y-6 sm:space-y-8 lg:space-y-2">
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
                    className="flex items-baseline gap-4 sm:gap-6 md:gap-8 lg:gap-10"
                  >
                    <span
                      className={`text-xs sm:text-sm md:text-base shrink-0 font-mono transition-all duration-300 ${
                        pathname === item.href
                          ? "text-secondary opacity-100"
                          : "text-primary-foreground opacity-40 group-hover:opacity-100 group-hover:text-secondary"
                      }`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight font-serif transition-all duration-500 text-primary-foreground ${
                        pathname === item.href
                          ? "opacity-100 tracking-wider"
                          : "opacity-60 tracking-wide group-hover:opacity-100 group-hover:tracking-wider"
                      }`}
                    >
                      {item.title}
                      {/* Underline sweep */}
                      <span
                        className={`absolute -bottom-1 left-0 h-px bg-secondary transition-all duration-500 ease-out ${
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

            {/* Sidebar info */}
            <div
              ref={sidebarRef}
              className="absolute top-44 right-0 sm:top-6 sm:right-0 md:top-8 lg:bottom-8 lg:right-0 lg:top-auto"
            >
              <div className="flex flex-col gap-6 md:gap-8 text-xs sm:text-sm text-primary-foreground/50 border-l border-primary-foreground/15 pl-4 sm:pl-6">
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-primary-foreground/80 text-xs">
                    SERVICES
                  </p>
                  <p className="font-light leading-relaxed font-serif">
                    Seamless Voting · Ticketing · Nominations
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-primary-foreground/80 text-xs">
                    LOCATION
                  </p>
                  <p className="font-light font-serif">Koforidua, Ghana</p>
                </div>
                <div className="space-y-1">
                  <p className="tracking-widest font-serif text-primary-foreground/80 text-xs">
                    SOCIAL
                  </p>
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
