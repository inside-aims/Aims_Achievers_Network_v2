"use client";

import { QrCode } from "lucide-react";

const leaderboardRows = [
  { rank: 1, name: "Ama K.", pct: 78, votes: "1,204" },
  { rank: 2, name: "Kojo A.", pct: 54, votes: "842" },
  { rank: 3, name: "Efua B.", pct: 31, votes: "512" },
];

export default function ProductShowcase() {
  return (
    <section className="bg-background text-foreground feature-no py-20 md:py-28">
      <div className="mb-14 md:mb-16 flex items-center gap-6">
        <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground shrink-0">
          SEE IT IN ACTION
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-[1.05] mb-16 md:mb-20 max-w-2xl">
        What your voters and
        <br />
        <span className="opacity-60">guests actually see.</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Mock: live leaderboard */}
        <div className="border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/40">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
            <span className="ml-3 text-[11px] font-mono text-muted-foreground/50 truncate">
              aimsachievers.network/events/best-dressed-2025
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-lg sm:text-xl font-light">Best Dressed Awards</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-secondary shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="space-y-5">
              {leaderboardRows.map((row) => (
                <div key={row.rank}>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="flex items-center gap-3 font-light">
                      <span className="text-xs font-mono text-muted-foreground/40">
                        #{row.rank}
                      </span>
                      {row.name}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground/50">
                      {row.votes} votes
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mock: e-ticket */}
        <div className="relative border border-border rounded-lg bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 sm:p-8 pb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground/50 uppercase">
                E-Ticket
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-secondary uppercase">
                Valid
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-light leading-snug">
              Campus Icon Awards — Finals Night
            </h3>
            <p className="mt-2 text-xs font-mono text-muted-foreground/50 tracking-wide">
              SAT, 22 NOV · GREAT HALL, KOFORIDUA
            </p>
          </div>

          {/* Perforated divider */}
          <div className="relative h-px bg-border">
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
            <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background" />
          </div>

          <div className="p-6 sm:p-8 pt-8 flex items-center justify-between flex-1">
            <div>
              <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mb-1">
                Ticket Holder
              </div>
              <div className="font-serif text-base mb-4">Nana Adjei</div>
              <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mb-1">
                Ticket Code
              </div>
              <div className="font-mono text-sm tracking-widest">AAN-7X9K2</div>
            </div>
            <div className="w-20 h-20 border border-border rounded-md flex items-center justify-center bg-background shrink-0">
              <QrCode className="w-11 h-11 text-foreground/70" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
