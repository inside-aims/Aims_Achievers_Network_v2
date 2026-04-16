import type { Metadata } from "next";
import { UserSettings } from "@/components/features/dashboard/user/settings/user-settings";

export const metadata: Metadata = { title: "Settings | AIMS Achievers Network" };

export default function UserSettingsPage() {
  return <UserSettings />;
}
