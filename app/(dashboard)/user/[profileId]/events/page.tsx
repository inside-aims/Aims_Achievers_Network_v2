import type { Metadata } from "next";
import { UserEvents } from "@/components/features/dashboard/user/events/user-events";

export const metadata: Metadata = { title: "My Events | AIMS Achievers Network" };

export default async function UserEventsPage({ params }: { params: Promise<{ profileId: string }> }) {
  const { profileId } = await params;
  return <UserEvents base={`/user/${profileId}`} />;
}
