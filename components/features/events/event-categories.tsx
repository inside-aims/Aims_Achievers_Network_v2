"use client";

import { Clock, Layers, Search, Ticket } from "lucide-react";
import CategoryCard from "@/components/features/events/category-card";
import { getDaysLeft } from "@/lib/utils";
import { useMemo, useState } from "react";
import SearchBar from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import FeatureNavigationWrapper from "@/components/shared/feature-navigation-wrapper";
import { useEvent } from "@/hooks/use-event";
import { CategoryCardSkeleton } from "@/components/ui/skeleton";
import TicketPurchaseSection from "@/components/features/tickets/ticket-purchase-section";
import TicketPurchaseModal from "@/components/features/tickets/ticket-purchase-modal";
import { isTicketingEnabled, getEventTicketInfo } from "@/components/features/tickets/mock-data";
import { TicketType } from "@/components/features/tickets";

const EventCategories = ({ eventId }: { eventId: string }) => {
  const [query, setQuery] = useState<string>("");
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const { event, loading, error } = useEvent(eventId);

  const ticketInfo = isTicketingEnabled(eventId) ? getEventTicketInfo(eventId) : undefined;

  const eventCategories = useMemo(() => {
    if (!event) return [];
    return event.categories.filter((cat) =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [event, query]);

  if (loading) {
    return (
      <FeatureNavigationWrapper>
        <div className="space-y-2">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </FeatureNavigationWrapper>
    );
  }

  if (error || !event) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        {error ?? "No event found for this ID"}
      </div>
    );
  }

  const daysLeft = getDaysLeft(event.endDate);

  return (
    <FeatureNavigationWrapper key="event-categories">
      <div className="space-y-2 md:space-y-3">
        <h1 className="text-xl font-bold md:text-4xl">{event.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{event.description}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          className="rounded-full bg-muted"
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <Search className="text-primary" />
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full border border-primary/10 bg-muted"
        >
          <Layers className="h-4 w-4 text-primary" />
          {event.categories.length} Categories
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full bg-muted border border-primary/10"
        >
          <Clock className="h-4 w-4 text-primary" />
          {daysLeft === 0 ? "Event ended" : `${daysLeft} days left`}
        </Button>
        {ticketInfo && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full bg-secondary/70 border border-secondary/40 text-secondary-foreground hover:bg-secondary/90"
            onClick={() =>
              document.getElementById("tickets-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <Ticket className="h-4 w-4" />
            Get Tickets
          </Button>
        )}
        {showSearchBar && <SearchBar query={query} setQuery={setQuery} />}
      </div>

      {eventCategories.length > 0 && (
        <div className="grid gap-4 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {eventCategories.map((category) => (
            <CategoryCard
              key={category.id}
              eventId={eventId}
              daysLeft={daysLeft}
              {...category}
            />
          ))}
        </div>
      )}

      {eventCategories.length === 0 && (
        <EmptyState onReset={() => setQuery("")} />
      )}

      {ticketInfo && (
        <TicketPurchaseSection
          ticketInfo={ticketInfo}
          onSelectType={(type) => {
            setSelectedTicketType(type);
            setTicketModalOpen(true);
          }}
        />
      )}

      {ticketInfo && (
        <TicketPurchaseModal
          open={ticketModalOpen}
          setOpen={setTicketModalOpen}
          ticketInfo={ticketInfo}
          selectedType={selectedTicketType}
        />
      )}
    </FeatureNavigationWrapper>
  );
};

export default EventCategories;
