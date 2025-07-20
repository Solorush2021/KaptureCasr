"use client";

import { useState } from 'react';
import { PlusCircle, Briefcase, Tag, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockAgents } from '@/lib/mock-data';
import type { Agent } from '@/lib/types';
import { PageHeader } from '@/components/page-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key in Agent['status']]: string } = {
  ONLINE: 'bg-green-500',
  OFFLINE: 'bg-slate-400',
  BUSY: 'bg-red-500',
  ON_BREAK: 'bg-yellow-500',
};

function AddAgentDialog({ onAgentAdd }: { onAgentAdd: (agent: Agent) => void }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleAddAgent = () => {
    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    const newAgent: Agent = {
      id: `agent-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      status: 'OFFLINE',
      skillTags: ['Newbie'],
      maxConcurrentTickets: 5,
      avatarUrl: 'https://placehold.co/100x100',
    };
    onAgentAdd(newAgent);
    toast({
      title: "Agent Added",
      description: `${name} has been added to the team.`,
    });
    setOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
          <DialogDescription>
            Enter the details for the new agent. They will be added with OFFLINE status by default.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g. John Doe" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" placeholder="e.g. john.doe@kapture.cx" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddAgent}><UserPlus className="mr-2" /> Add Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [newAgent, ...prev]);
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Agent Management"
        description="View, add, and manage your support agents."
      >
        <AddAgentDialog onAgentAdd={handleAgentAdd} />
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
