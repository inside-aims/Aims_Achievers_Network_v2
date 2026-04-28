import type { Metadata } from "next";
import { AdminSettings } from "@/components/features/dashboard/admin/settings/admin-settings";

export const metadata: Metadata = { title: "Settings | AIMS Achievers Network" };

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
