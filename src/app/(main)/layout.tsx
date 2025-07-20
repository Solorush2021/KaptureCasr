
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
import { useToast } from "@/hooks/use-toast";
import { mockAgents } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", icon: Icons.Dashboard, label: "Dashboard" },
  { href: "/tickets", icon: Icons.Tickets, label: "Tickets" },
  { href: "/agents", icon: Icons.Agents, label: "Agents" },
  { href: "/routing", icon: Icons.Routing, label: "Intelligent Routing" },
  { href: "/live-view", icon: Icons.LiveView, label: "Live View" },
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

const ambientNotifications = [
    { title: "🎉 New 5-star review!", description: (agent: string) => `Great job, ${agent}! A customer left a 5-star review.` },
    { title: "📈 Record Breaker!", description: (agent: string) => `${agent} just set a new personal record for fastest ticket resolution!` },
    { title: "🔔 Reminder", description: (agent: string) => `${agent}, you have tickets nearing their SLA breach time.` },
    { title: "⚠️ High-Priority Ticket", description: () => `A high-priority ticket has been unassigned for 10 minutes.` },
];


function AmbientNotifier() {
    const { toast } = useToast();
    const [agents] = React.useState(mockAgents);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const randomNotification = ambientNotifications[Math.floor(Math.random() * ambientNotifications.length)];
            const randomAgent = agents[Math.floor(Math.random() * agents.length)];
            
            const description = typeof randomNotification.description === 'function' 
                ? randomNotification.description(randomAgent.name)
                : randomNotification.description;

            toast({
                title: randomNotification.title,
                description: description,
                variant: 'default'
            });
        }, 15000); // Every 15 seconds

        return () => clearInterval(interval);
    }, [toast, agents]);

    return null;
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
        <AmbientNotifier />
      </div>
    </SidebarProvider>
  );
}
