"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Settings2,
  LogOut,
  ChevronUp,
  Plus,
} from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_NAV = [
  { label: "Dashboard",  icon: LayoutDashboard, href: ""            },
  { label: "Events",     icon: CalendarDays,    href: "/events"     },
  { label: "Organizers", icon: Users,           href: "/organizers" },
  { label: "Analytics",  icon: BarChart3,       href: "/analytics"  },
  { label: "Settings",   icon: Settings2,       href: "/settings"   },
];

const USER_NAV = [
  { label: "Dashboard",  icon: LayoutDashboard, href: ""           },
  { label: "Events",     icon: CalendarDays,    href: "/events"    },
  { label: "New Event",  icon: Plus,            href: "/new-event"  },
  { label: "Analytics",  icon: BarChart3,       href: "/analytics" },
  { label: "Settings",   icon: Settings2,       href: "/settings"   },

];

export function AppSidebar() {
  const pathname = usePathname();
  const params   = useParams();
  const uuid     = params.uuid as string;
  const isAdmin  = pathname.startsWith("/admin");
  const base     = isAdmin ? `/admin/${uuid}` : `/user/${uuid}`;
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;

  const { signOut } = useAuthActions();
  const profile = useQuery(api.users.getMyProfile);

  const initials = profile?.displayName
    ? profile.displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <Sidebar collapsible="icon">

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={base}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-xs shrink-0">
                  AAN
                </div>
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                  <span className="font-semibold text-sm truncate">AAN</span>
                  <span className="text-[11px] text-sidebar-foreground/60 truncate">
                    {isAdmin ? "Admin Portal" : "Organiser Portal"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className={""}>
            {navItems.map((item) => {
              const href     = `${base}${item.href}`;
              const isActive = item.href === ""
                ? pathname === base
                : pathname.startsWith(href);

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}  className={"h-10"}>
                    <Link href={href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User menu ─────────────────────────────────────────── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                  tooltip={profile?.displayName ?? "Account"}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-semibold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none min-w-0">
                    <span className="font-medium text-sm truncate">
                      {profile?.displayName ?? "Loading…"}
                    </span>
                    <span className="text-[11px] text-sidebar-foreground/60 capitalize">
                      {profile?.role ?? ""}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

    </Sidebar>
  );
}
