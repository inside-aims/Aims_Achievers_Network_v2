import type { Metadata } from "next";
import { ComingSoon } from "@/components/features/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Nominees | AIMS Achievers Network" };

export default function CategoryNomineesPage() {
  return <ComingSoon title="Nominees" />;
}
