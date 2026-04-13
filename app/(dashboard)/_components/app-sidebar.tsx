"use client";

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
  Images,
  ClipboardList,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const ADMIN_NAV = [
  { label: "Dashboard",  icon: LayoutDashboard, href: ""            },
  { label: "Events",     icon: CalendarDays,    href: "/events"     },
  { label: "Organizers", icon: Users,           href: "/organizers" },
  { label: "Analytics",  icon: BarChart3,       href: "/analytics"  },
  { label: "Settings",   icon: Settings2,       href: "/settings"   },
];

const USER_NAV = [
  { label: "Dashboard",   icon: LayoutDashboard, href: ""              },
  { label: "Events",      icon: CalendarDays,    href: "/events"       },
  { label: "New Event",   icon: Plus,            href: "/new-event"    },
  { label: "Nominations", icon: ClipboardList,   href: "/nominations"  },
  { label: "Highlights",  icon: Images,          href: "/highlights"   },
  { label: "Analytics",   icon: BarChart3,       href: "/analytics"    },
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
              <DropdownMenuContent side="top" align="start" className="w-(--radix-popper-anchor-width) p-1.5">
                {/* Mini profile card at top */}
                <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
                  <div className="flex aspect-square size-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{profile?.displayName ?? "—"}</p>
                    <p className="text-[11px] text-muted-foreground capitalize truncate">{profile?.role ?? ""}</p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="cursor-pointer gap-2 mt-1">
                  <Link href={`${base}/settings`}>
                    <Settings2 className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer gap-2"
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
