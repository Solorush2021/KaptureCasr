
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { mockAgents, mockTickets } from "@/lib/mock-data";
import type { Agent, Ticket } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key in Agent['status']]: string } = {
  ONLINE: 'bg-green-500',
  OFFLINE: 'bg-slate-400',
  BUSY: 'bg-red-500',
  ON_BREAK: 'bg-yellow-500',
};

const statusText: { [key in Agent['status']]: string } = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  BUSY: 'Busy',
  ON_BREAK: 'On Break',
};

export default function LiveViewPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [ticketsByAgent, setTicketsByAgent] = useState<Record<string, Ticket[]>>({});
  const { toast } = useToast();

  const groupTicketsByAgent = () => {
     const ticketsGroupedByAgent: Record<string, Ticket[]> = {};
    mockTickets
      .filter(t => t.agentId && (t.status === 'ASSIGNED' || t.status === 'OPEN' || t.status === 'PENDING_AGENT_REPLY'))
      .forEach(ticket => {
        if (ticket.agentId) {
          if (!ticketsGroupedByAgent[ticket.agentId]) {
            ticketsGroupedByAgent[ticket.agentId] = [];
          }
          ticketsGroupedByAgent[ticket.agentId].push(ticket);
        }
      });
    setTicketsByAgent(ticketsGroupedByAgent);
  }

  useEffect(() => {
    groupTicketsByAgent();
  }, []);
  
  const handleRefresh = () => {
    groupTicketsByAgent();
    toast({
        title: "Board Refreshed",
        description: "The live agent status board has been updated.",
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Live Agent Status Board"
        description="Monitor agent activity and ticket assignments in real-time."
      >
        <Button onClick={handleRefresh}>
            <RefreshCcw className="mr-2 h-4 w-4"/>
            Refresh Board
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => {
          const assignedTickets = ticketsByAgent[agent.id] || [];
          const workload = Math.min(100, (assignedTickets.length / agent.maxConcurrentTickets) * 100);

          return (
            <Card key={agent.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={agent.avatarUrl} alt={agent.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${statusColors[agent.status]}`} />
                    <span className="text-xs text-muted-foreground">{statusText[agent.status]}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Current Workload</span>
                    <span className="text-sm font-bold">{assignedTickets.length} / {agent.maxConcurrentTickets}</span>
                  </div>
                  <Progress value={workload} className="h-2" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Active Tickets</h4>
                  {assignedTickets.length > 0 ? (
                    <div className="space-y-2">
                      {assignedTickets.map(ticket => (
                        <div key={ticket.id} className="flex items-center justify-between text-xs p-2 rounded-md bg-muted/50">
                           <span className="font-semibold truncate pr-2">{ticket.title}</span>
                           <Badge variant={ticket.priority === 'URGENT' || ticket.priority === 'HIGH' ? 'destructive' : 'secondary'} className="text-xs">{ticket.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">No active tickets.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
