"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

const voterFaqs = [
  {
    question: "Is my payment safe when I vote or buy a ticket?",
    answer:
      "Yes — every payment runs through a verified checkout (card or mobile money). You'll get a confirmation once it clears, and your vote or ticket is issued only after payment is verified.",
  },
  {
    question: "Can someone stuff votes for their favorite?",
    answer:
      "No. Every vote is tied to a verified payment — there's no free or duplicate voting. What shows on the leaderboard is exactly what was paid for, nothing more.",
  },
  {
    question: "I bought the wrong ticket — can I get a refund?",
    answer:
      "Reach out to the event organizer directly from your confirmation email; they can cancel and refund a ticket through their dashboard before the event.",
  },
];

const organizerFaqs = [
  {
    question: "What does it cost to run an event?",
    answer:
      "A transparent percentage on each vote or ticket sold, agreed upfront before you go live. No setup fees, no hidden charges — the rate is locked in for your event and never changes retroactively.",
  },
  {
    question: "How fast do organizers get paid?",
    answer:
      "Payouts go straight to the organizer's mobile money or bank account once the event closes — no manual invoicing, no chasing anyone down.",
  },
  {
    question: "Can I run ticketing without voting, or voting without ticketing?",
    answer:
      "Yes. Every event is configured independently — award voting, ticket sales, or both under the same event, entirely the organizer's call.",
  },
];

function FaqGroup({
  label,
  faqs,
  groupId,
}: {
  label: string;
  faqs: { question: string; answer: string }[];
  groupId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <span className="block text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground/60 mb-6">
        {label}
      </span>
      <div className="divide-y divide-border">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={`${groupId}-${faq.question}`} className="py-5 first:pt-0">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-start gap-4 text-left group -mx-3 px-3 py-1 rounded-md hover:bg-muted/40 transition-colors duration-300"
              >
                <span className="text-xs font-mono text-muted-foreground/30 pt-1.5 shrink-0">
                  0{i + 1}
                </span>
                <span className="flex-1 text-base font-serif font-light tracking-wide pt-0.5 group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </span>
                <Plus
                  className={`w-4 h-4 mt-1 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm font-light text-muted-foreground leading-relaxed pt-3 pl-8">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-background text-foreground feature-no py-20 md:py-28">
      <div className="mb-14 md:mb-16 flex items-center gap-6">
        <span className="text-xs tracking-[0.25em] font-mono text-muted-foreground shrink-0">
          BEFORE YOU START
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-serif tracking-tight leading-[1.05] mb-14 md:mb-16 max-w-2xl">
        Questions voters and organizers
        <br />
        <span className="opacity-60">ask before their first event.</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        <FaqGroup label="For Voters & Guests" faqs={voterFaqs} groupId="voter" />
        <FaqGroup label="For Organizers" faqs={organizerFaqs} groupId="organizer" />
      </div>
    </section>
  );
}
