"use client";

import { CalendarCog, Radio, Wallet } from "lucide-react";

const pillars = [
  {
    icon: CalendarCog,
    title: "Set up",
    description: "Categories, nominees, ticket tiers — published in minutes, no code required.",
  },
  {
    icon: Radio,
    title: "Go live",
    description: "Voters pay per vote, guests grab a ticket. Everything updates in real time.",
  },
  {
    icon: Wallet,
    title: "Get paid",
    description: "Payouts land in your mobile money or bank account, automatically split.",
  },
];

export default function Pillars() {
  return (
    <section className="bg-background text-foreground feature-no py-14 md:py-16 border-b border-border/50">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="flex items-start gap-4 py-6 sm:py-0 sm:px-8 first:pl-0 first:pt-0">
              <Icon className="w-6 h-6 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <h3 className="text-base font-serif font-light tracking-wide mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
