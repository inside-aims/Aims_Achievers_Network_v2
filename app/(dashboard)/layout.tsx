import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { NavHeader } from "./_components/nav-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavHeader />
        <div className="dash-page">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
