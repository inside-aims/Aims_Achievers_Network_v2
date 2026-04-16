import type { Metadata } from "next";
import { ComingSoon } from "@/components/features/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Events | AIMS Achievers Network" };

export default function AdminEventsPage() {
  return <ComingSoon title="Events" />;
}
