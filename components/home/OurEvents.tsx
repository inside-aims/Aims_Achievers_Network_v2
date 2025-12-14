// EventsGrid.tsx
"use client";
import EventNameTag from "../ui/event-card";

export default function EventsGrid() {

  return (
    <section className="bg-background text-foreground font-serif py-10 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[110%] text-foreground mb-4 sm:mb-6 md:mb-8">
            Event Sneak Peak
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-muted-foreground max-w-3xl">
            Each event is thoughtfully crafted, not just to happen, but to be
            remembered. From the first idea to the final applause, we design
            experiences that bring people together, create real connections, and
            leave our partners, participants, and stakeholders proud to be part
            of something meaningful.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-10 py-10">
            <EventNameTag
              eventName={"COMPSSA X'clusive Awards"}
              location={"Koforidua"}
              status={"past"}
              imageUrl={"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"}
            />
            <EventNameTag
              eventName={"COMPSSA X'clusive Awards"}
              location={"Koforidua"}
              status={"past"}
              imageUrl={"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"}
            />
            <EventNameTag
              eventName={"COMPSSA X'clusive Awards"}
              location={"Koforidua"}
              status={"past"}
              imageUrl={"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80"}
            />
            <EventNameTag
              eventName={"COMPSSA X'clusive Awards"}
              location={"Koforidua"}
              status={"past"}
              imageUrl={"https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=80"}
            />
            <EventNameTag
              eventName={"COMPSSA X'clusive Awards"}
              location={"Koforidua"}
              status={"past"}
              imageUrl={"https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=80"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
