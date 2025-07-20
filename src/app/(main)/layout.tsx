"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", icon: Icons.Dashboard, label: "Dashboard" },
  { href: "/tickets", icon: Icons.Tickets, label: "Tickets" },
  { href: "/agents", icon: Icons.Agents, label: "Agents" },
  { href: "/routing", icon: Icons.Routing, label: "Intelligent Routing" },
  { href: "/settings", icon: Icons.Settings, label: "Settings" },
];

function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <Icons.Logo className="size-8 text-primary" />
          <span className="text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            KaptureCast
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Avatar className="size-8">
            <AvatarImage src="https://placehold.co/100x100" alt="Admin" data-ai-hint="person avatar" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          {state === 'expanded' && (
            <div className="flex flex-col text-sm">
              <span className="font-semibold text-sidebar-foreground">Admin</span>
              <span className="text-xs text-muted-foreground">admin@kapture.cx</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="max-w-full overflow-x-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-end gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
            <SidebarTrigger className="md:hidden" />
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
