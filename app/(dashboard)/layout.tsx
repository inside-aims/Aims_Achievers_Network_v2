import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import { NavHeader } from "./_components/nav-header";
import { DashboardGuard } from "./_components/dashboard-guard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavHeader />
        <div className="dash-page">
          <DashboardGuard>
            {children}
          </DashboardGuard>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
