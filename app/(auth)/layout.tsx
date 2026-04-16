import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: {
    template: "%s | AIMS Achievers Network",
    default: "AIMS Achievers Network - Seamless Voting, Ticketing & Nominations"
  },
  description: "Sign in or create your AIMS Achievers Network organiser account.",
};

const features = [
  "Create and manage award events",
  "Real-time voting and live results",
  "Nominee and category management",
  "Revenue tracking and analytics",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* ─── MOBILE layout ─────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen md:hidden">
        <div
          className="bg-primary relative overflow-hidden flex flex-col justify-between px-7 pt-8 pb-14 shrink-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-secondary/10 pointer-events-none" />

          <Link href="/" className="relative z-10 w-fit">
            <span className="text-primary-foreground font-bold text-xl tracking-tight">AAN</span>
          </Link>

          <div className="relative z-10 space-y-2">
            <p className="text-secondary text-xs font-semibold uppercase tracking-widest">
              Organiser Portal
            </p>
            <h2 className="text-primary-foreground text-2xl font-bold leading-snug">
              Manage Events.
              <br />
              <span className="text-secondary">Track</span> Results.
            </h2>
          </div>
        </div>

        {/* Form card lifts from the banner */}
        <div className="flex-1 -mt-6 rounded-t-3xl bg-background shadow-xl px-6 pt-8 pb-12">
          {children}
        </div>
      </div>

      {/* ─── DESKTOP layout ─────────────────────────────────────── */}
      <div className="hidden md:flex min-h-screen">
        {/* Left branding panel */}
        <div
          className="w-[42%] xl:w-[40%] bg-primary flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-28 -left-14 w-96 h-96 rounded-full bg-secondary/10 pointer-events-none" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-white/[0.03] pointer-events-none" />

          {/* Logo */}
          <Link href="/" className="relative z-10 w-fit group">
            <span className="text-primary-foreground font-bold text-xl tracking-tight group-hover:text-secondary transition-colors duration-300">
              AAN
            </span>
          </Link>

          {/* Main content */}
          <div className="relative z-10 space-y-7">
            <div className="space-y-1">
              <p className="text-secondary text-xs font-semibold uppercase tracking-widest">
                Organiser Portal
              </p>
              <div className="w-8 h-0.5 bg-secondary/50 rounded-full mt-2" />
            </div>

            <div className="space-y-3">
              <h2 className="text-primary-foreground text-3xl xl:text-[2.4rem] font-bold leading-[1.2]">
                Manage Events.
                <br />
                <span className="text-secondary">Track</span> Results.
                <br />
                Drive Excellence.
              </h2>
              <p className="text-primary-foreground/60 text-sm xl:text-base max-w-xs leading-relaxed">
                The all-in-one portal for running Ghana&apos;s premier campus
                awards events — from nominations to live voting results.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-2.5">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-secondary shrink-0" />
                  <span className="text-primary-foreground/70 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — copyright only, watermark absolute */}
          <div className="relative z-10">
            <p className="text-primary-foreground/40 text-xs">
              © {new Date().getFullYear()} AIMS Achievers Network
            </p>
          </div>

          {/* AAN watermark — absolute so it doesn't shift layout */}
          <span className="absolute bottom-8 right-10 text-primary-foreground/[0.06] font-bold leading-none select-none pointer-events-none"
            style={{ fontSize: "9rem" }}>
            AAN
          </span>
        </div>

        {/* Right form panel */}
        <div className="flex-1 bg-background flex items-center justify-center p-10 xl:p-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
