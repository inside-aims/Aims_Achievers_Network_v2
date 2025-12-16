import EventCategories from "@/components/features/events/event-categories";

interface Props {
  params: Promise<{ eventId: string }>;
}

export default async function EventCategoriesPage({ params }: Props) {
  const { eventId } = await params;

  return(
    <div id={"eventCategories"} className="feature">
      <EventCategories eventId={eventId} />
    </div>
  )
}
