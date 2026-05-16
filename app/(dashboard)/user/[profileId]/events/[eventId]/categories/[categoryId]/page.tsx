import type { Metadata } from "next";
import { CategoryNominees } from "@/components/features/dashboard/user/events/category-nominees";

export const metadata: Metadata = { title: "Nominee Images | AIMS Achievers Network" };

export default async function CategoryNomineesPage({
  params,
}: {
  params: Promise<{ profileId: string; eventId: string; categoryId: string }>;
}) {
  const { profileId, eventId, categoryId } = await params;
  return <CategoryNominees profileId={profileId} eventId={eventId} categoryId={categoryId} />;
}
