import CategoryNominees from "@/components/features/events/category-nominees";

interface Props {
  params: Promise< { eventId: string; categoryId: string }>;
}

export default async function EventCategoryNomineesPage({ params }: Props) {
  const {eventId, categoryId } = await params;

  return (
    <div className="feature">
      <CategoryNominees eventId={eventId} categoryId={categoryId} />
    </div>
  );
}
