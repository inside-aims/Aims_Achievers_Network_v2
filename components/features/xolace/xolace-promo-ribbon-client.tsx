"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const WEBSITE = "https://www.xolaceinc.com/";
const IOS =
  "https://apps.apple.com/gh/app/xolace/id6761601429";
const ANDROID =
  "https://play.google.com/store/apps/details?id=com.xolaceincorg.xolace";

const DISMISS_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const XolacePromoRibbonClient = ({ version }: { version: string }) => {
  const [hidden, setHidden] = useState(false);

  // Resolve at click time: iOS → App Store, Android → Play, else → website hub.
  // The static href below keeps the website hub as the no-JS / middle-click target.
  const openTarget = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const ua = navigator.userAgent || "";
    let url = WEBSITE;
    if (/iPhone|iPad|iPod/i.test(ua)) url = IOS;
    else if (/Android/i.test(ua)) url = ANDROID;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const dismiss = () => {
    document.cookie = `xolace_promo=${version}; path=/; max-age=${DISMISS_MAX_AGE}; samesite=lax`;
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div
      role="region"
      aria-label="A message from Xolace"
      className="relative border-b border-border bg-muted/50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-2 text-center sm:gap-3 sm:px-6">
        <Image
          src="/assets/images/campfire-mini.jpeg"
          alt=""
          aria-hidden
          width={28}
          height={28}
          className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-border/60"
        />
        <p className="text-xs leading-snug text-foreground/80 sm:text-sm">
          <span className="font-serif sm:hidden">
            Somewhere quiet to feel it out.{" "}
          </span>
          <span className="hidden font-serif sm:inline">
            For the feelings that don&apos;t need a therapist, but don&apos;t
            belong on a feed.{" "}
          </span>
          <span className="hidden text-muted-foreground md:inline">
            Xolace is a quiet place to sit with what you&apos;re carrying.{" "}
          </span>
        </p>
        <a
          href={WEBSITE}
          onClick={openTarget}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium text-foreground sm:text-sm"
        >
          <span className="relative">
            <span className="sm:hidden">Get Xolace</span>
            <span className="hidden sm:inline">Find your quiet</span>
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-secondary transition-all duration-300 ease-out group-hover:w-full" />
          </span>
          <span aria-hidden>→</span>
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss Xolace message"
        className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-4"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default XolacePromoRibbonClient;
