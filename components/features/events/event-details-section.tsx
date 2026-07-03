"use client";

import {
  CalendarClock,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Phone,
  RotateCcw,
  ShieldAlert,
  Shirt,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NoDataState from "@/components/shared/no-data-state";
import { cn } from "@/lib/utils";

interface AgendaItem {
  time: string;
  title: string;
  description?: string;
}

interface LineupItem {
  name: string;
  role: string;
  imageUrl?: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface Sponsor {
  name: string;
  logoUrl?: string;
}

export interface EventDetails {
  agenda: AgendaItem[];
  lineup: LineupItem[];
  dressCode?: string;
  ageRestriction?: string;
  venueNotes?: string;
  refundPolicy?: string;
  termsNote?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks: SocialLink[];
  faqs: Faq[];
  sponsors: Sponsor[];
}

const DetailCard = ({
  icon: Icon,
  title,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={cn(
      "rounded-md border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
      className
    )}
  >
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h3 className="text-sm font-bold">{title}</h3>
    </div>
    <div className="p-4 md:p-5">{children}</div>
  </div>
);

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const EventDetailsSection = ({ details }: { details: EventDetails }) => {
  const goodToKnow = [
    details.dressCode && { icon: Shirt, label: "Dress Code", value: details.dressCode },
    details.ageRestriction && { icon: ShieldAlert, label: "Age Restriction", value: details.ageRestriction },
    details.venueNotes && { icon: Info, label: "Venue Notes", value: details.venueNotes },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  const hasContact = details.contactEmail || details.contactPhone || details.socialLinks.length > 0;
  const hasPolicies = details.refundPolicy || details.termsNote;

  const isEmpty =
    details.agenda.length === 0 &&
    details.lineup.length === 0 &&
    goodToKnow.length === 0 &&
    !hasPolicies &&
    !hasContact &&
    details.faqs.length === 0 &&
    details.sponsors.length === 0;

  if (isEmpty) {
    return (
      <section id="details-section" className="space-y-3">
        <NoDataState
          icon={Info}
          title="No event details yet"
          description="The organizer hasn't added agenda, lineup, or other details for this event yet."
        />
      </section>
    );
  }

  return (
    <section id="details-section" className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Event Details
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {details.agenda.length > 0 && (
          <DetailCard icon={CalendarClock} title="Agenda" className="sm:col-span-2">
            <div>
              {details.agenda.map((item, i) => (
                <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary ring-4 ring-primary/10" />
                    {i !== details.agenda.length - 1 && (
                      <span className="mt-1 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 -mt-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="h-5 border-transparent bg-primary/10 font-mono text-[10px] text-primary">
                        {item.time}
                      </Badge>
                      <p className="text-sm font-semibold">{item.title}</p>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>
        )}

        {details.lineup.length > 0 && (
          <DetailCard icon={Users} title="Lineup">
            <div className="space-y-3">
              {details.lineup.map((person, i) => (
                <div key={i} className="flex items-center gap-3">
                  {person.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/60 text-xs font-bold text-secondary-foreground">
                      {initials(person.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{person.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>
        )}

        {goodToKnow.length > 0 && (
          <DetailCard icon={Sparkles} title="Good to Know">
            <div className="space-y-3">
              {goodToKnow.map(({ icon: Icon, label, value }, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium">{label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>
        )}

        {hasPolicies && (
          <DetailCard icon={FileText} title="Policies">
            <div className="space-y-2 text-sm text-muted-foreground">
              {details.refundPolicy && (
                <p className="flex gap-2">
                  <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
                  {details.refundPolicy}
                </p>
              )}
              {details.termsNote && <p>{details.termsNote}</p>}
            </div>
          </DetailCard>
        )}

        {hasContact && (
          <DetailCard icon={Mail} title="Contact">
            <div className="flex flex-wrap gap-2">
              {details.contactEmail && (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-muted px-3 py-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  {details.contactEmail}
                </span>
              )}
              {details.contactPhone && (
                <span className="flex items-center gap-1.5 rounded-full border border-primary/10 bg-muted px-3 py-1.5 text-xs">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {details.contactPhone}
                </span>
              )}
              {details.socialLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </DetailCard>
        )}

        {details.sponsors.length > 0 && (
          <DetailCard icon={Sparkles} title="Sponsors">
            <div className="flex flex-wrap gap-2">
              {details.sponsors.map((sponsor, i) => (
                <span
                  key={i}
                  className="rounded-full border border-primary/10 bg-muted px-3 py-1.5 text-xs font-medium"
                >
                  {sponsor.name}
                </span>
              ))}
            </div>
          </DetailCard>
        )}

        {details.faqs.length > 0 && (
          <DetailCard icon={HelpCircle} title="FAQs" className="sm:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {details.faqs.map((faq, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    Q
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">{faq.question}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </DetailCard>
        )}
      </div>
    </section>
  );
};

export default EventDetailsSection;
