"use client";

import { useState } from 'react';
import { PlusCircle, Briefcase, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockAgents } from '@/lib/mock-data';
import type { Agent } from '@/lib/types';
import { PageHeader } from '@/components/page-header';

const statusColors: { [key in Agent['status']]: string } = {
  ONLINE: 'bg-green-500',
  OFFLINE: 'bg-slate-400',
  BUSY: 'bg-red-500',
  ON_BREAK: 'bg-yellow-500',
};

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Agent Management"
        description="View, add, and manage your support agents."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Agent
        </Button>
      </PageHeader>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="relative flex flex-row items-start bg-muted/30 gap-4 p-4">
              <span className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full ${statusColors[agent.status]}`} title={agent.status}/>
              <Avatar className="h-16 w-16 border">
                <AvatarImage src={agent.avatarUrl} alt={agent.name} data-ai-hint="person avatar" />
                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">
                  {agent.name}
                </CardTitle>
                <CardDescription className="text-xs">{agent.email}</CardDescription>
                <Badge variant="outline" className="mt-2 text-xs">{agent.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span>Max Tickets: {agent.maxConcurrentTickets}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {agent.skillTags.map((skill) => (
                    <Badge key={skill} variant="secondary" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
