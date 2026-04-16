import type { Metadata } from "next";
import { UserNominations } from "@/components/features/dashboard/user/nominations/user-nominations";

export const metadata: Metadata = { title: "Nominations | AIMS Achievers Network" };

export default function UserNominationsPage() {
  return <UserNominations />;
}
