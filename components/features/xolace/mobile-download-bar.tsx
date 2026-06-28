"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DownloadButtons } from "@/components/shared/download-buttons";

export function MobileDownloadBar() {
  const [visible, setVisible] = useState(false);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    // Initial check on mount (async via rAF so it isn't a sync setState in the
    // effect body) — covers loads that start already scrolled past the threshold.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    // This platform has no dedicated "#download" section, so we hide the bar
    // once the footer scrolls into view — it carries the same intent and we
    // never want to cover the footer's own links.
    const target = document.querySelector("footer");
    let observer: IntersectionObserver | undefined;
    if (target) {
      observer = new IntersectionObserver(
        ([entry]) => setAtFooter(entry.isIntersecting),
        { threshold: 0.1 },
      );
      observer.observe(target);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  if (!visible || atFooter) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 flex flex-col items-center gap-2 border-t border-border/40 bg-background/80 px-6 py-3 backdrop-blur-xl md:hidden">
      <div className="flex items-center gap-2">
        <Image
          src="/assets/images/campfire-mini.jpeg"
          alt=""
          aria-hidden
          width={28}
          height={28}
          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-border/60"
        />
        <p className="text-center text-xs leading-snug text-muted-foreground">
          <span className="font-medium text-foreground">Get the Xolace app</span>{" "}
           somewhere quiet to feel it out
        </p>
      </div>
      <DownloadButtons align="center" />
    </div>
  );
}
