'use client';

import {ArrowLeft, Clock, Layers, Search,} from "lucide-react";
import CategoryCard from "@/components/features/events/category-card";
import {EVENTS} from "@/components/features/events";
import {getDaysLeft} from "@/lib/utils";
import {useMemo, useState} from "react";
import SearchBar from "@/components/shared/search-bar";
import {Button} from "@/components/ui/button";
import EmptyState from "@/components/shared/empty-state";
import {useRouter} from 'next/navigation';

const EventCategories = ({ eventId }: { eventId: string }) => {
  const [query, setQuery] = useState<string>("")
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  const router = useRouter();

  const event = EVENTS.find((event) => event.eventId === eventId);

  // Handle event categories filtering
  const eventCategories = useMemo(() => {
    if (!event) return [];

    return event.categories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [event, query]);


  if (!event) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        No event found for this ID
      </div>
    );
  }

  const daysLeft = getDaysLeft(event.endDate);

  return (
    <section className="flex flex-col gap-12">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant={"outline"}
          onClick={() => router.back()}
          className="flex items-center gap-2  w-8 h-8 rounded-full p-2 border"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold md:text-4xl">
            {event.title}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {event.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={"ghost"}
            className={"w-10 h-10 p-2 rounded-full bg-muted"}
            onClick={() => setShowSearchBar(!showSearchBar)}
          >
            <Search className={"text-primary"}/>
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-primary/10 bg-muted px-4 py-2 text-sm">
            <Layers className="h-4 w-4 text-primary"/>
            {event.categories.length} Categories
          </div>

          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm border border-primary/10">
            <Clock className="h-4 w-4 text-primary"/>
            {daysLeft === 0 ? "Event ended" : `${daysLeft} days left`}
          </div>

          {showSearchBar && (
            <SearchBar query={query} setQuery={setQuery}/>
          )}
        </div>
      </div>

      {/* List selected event categories */}
      {eventCategories.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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

      {/*No search event categories exist.*/}
      {eventCategories.length === 0 && (
        <EmptyState onReset={() => setQuery("")}/>
      )}
    </section>
  );
};

export default EventCategories;
