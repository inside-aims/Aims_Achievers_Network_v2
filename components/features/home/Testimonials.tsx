"use client";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

const testimonials = [
  {
    quote:
      "We ran our entire awards night on this platform — nominations, voting, the works. Payouts landed the same week. Our students trusted it more than the paper ballots we used to run.",
    name: "Ama Boateng",
    role: "Event Organizer, Koforidua Technical University",
  },
  {
    quote:
      "I bought my ticket in under a minute and scanned straight in at the door. No queue, no printed slip to lose. It just worked.",
    name: "Kwame Owusu",
    role: "Attendee, Best Dressed Awards Night",
  },
  {
    quote:
      "Winning felt real the moment I saw the leaderboard move live. My whole department was refreshing the page on finals night.",
    name: "Nana Yeboah",
    role: "Category Winner, Campus Icon Awards",
  },
  {
    quote:
      "Setting up ticket tiers took maybe ten minutes. We didn't need a single line of voting or nomination anything — just a clean way to sell out the room.",
    name: "Sena Tetteh",
    role: "Organizer, Rooftop Social Nights",
  },
];

const TestimonialCard = ({ t }: { t: (typeof testimonials)[number] }) => (
  <div className="whitespace-normal w-[340px] sm:w-[400px] mx-4 shrink-0 flex flex-col border border-primary-foreground/10 bg-primary-foreground/5 p-7 sm:p-8">
    <span className="text-4xl font-serif text-secondary/40 leading-none mb-4 select-none">
      &ldquo;
    </span>
    <p className="text-base font-serif font-light italic leading-relaxed text-primary-foreground/85 mb-8 flex-1">
      {t.quote}
    </p>
    <div className="flex items-center gap-3">
      <span className="w-9 h-9 shrink-0 rounded-full border border-secondary/30 bg-secondary/10 flex items-center justify-center text-xs font-mono text-secondary">
        {t.name.split(" ").map((part) => part[0]).join("")}
      </span>
      <div>
        <div className="text-sm font-light text-primary-foreground/90">{t.name}</div>
        <div className="text-[10px] font-mono tracking-[0.15em] text-primary-foreground/35 uppercase mt-1">
          {t.role}
        </div>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="bg-primary text-primary-foreground feature-no py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:52px_52px] pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-14 md:mb-16 flex items-center gap-6">
          <span className="text-xs tracking-[0.25em] font-mono text-primary-foreground/30 shrink-0">
            FROM THE FLOOR
          </span>
          <div className="h-px flex-1 bg-primary-foreground/10" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-[1.05] mb-14 md:mb-16 max-w-2xl">
          Told by the people
          <br />
          <span className="text-secondary italic">who showed up.</span>
        </h2>

        <div className="relative -mx-4 md:-mx-8 lg:-mx-16">
          <ScrollVelocityContainer>
            <ScrollVelocityRow baseVelocity={3} direction={1}>
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} t={t} />
              ))}
            </ScrollVelocityRow>
          </ScrollVelocityContainer>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-primary to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-primary to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
