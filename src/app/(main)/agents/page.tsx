
"use client";

import { useState } from 'react';
import { PlusCircle, Briefcase, Tag, UserPlus, MoreVertical, Edit, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

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
  const [skills, setSkills] = useState('');

  const handleAddAgent = () => {
    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const newAgent: Agent = {
      id: `agent-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      status: 'OFFLINE',
      skillTags: skills ? skills.split(',').map(s => s.trim()) : ['Newbie'],
      maxConcurrentTickets: 5,
      avatarUrl: `https://placehold.co/100x100?text=${name.charAt(0)}`,
    };
    onAgentAdd(newAgent);
    toast({
      title: "Agent Added",
      description: `${name} has been added to the team.`,
    });
    setOpen(false);
    setName('');
    setEmail('');
    setSkills('');
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
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skills" className="text-right">
              Skills
            </Label>
            <Textarea id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} className="col-span-3" placeholder="Billing, Technical, Sales (comma-separated)" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddAgent}><UserPlus className="mr-2" /> Add Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditAgentDialog({ agent, onAgentUpdate, children }: { agent: Agent, onAgentUpdate: (agent: Agent) => void, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [name, setName] = useState(agent.name);
  const [email, setEmail] = useState(agent.email);
  const [skills, setSkills] = useState(agent.skillTags.join(', '));

  const handleUpdateAgent = () => {
    if (!name || !email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required.",
        variant: "destructive",
      });
      return;
    }

    const updatedAgent: Agent = {
      ...agent,
      name,
      email,
      skillTags: skills.split(',').map(s => s.trim()),
    };
    onAgentUpdate(updatedAgent);
    toast({
      title: "Agent Updated",
      description: `${name}'s profile has been updated.`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Update the details for {agent.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name-edit" className="text-right">
              Name
            </Label>
            <Input id="name-edit" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-edit" className="text-right">
              Email
            </Label>
            <Input id="email-edit" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="skills-edit" className="text-right">
              Skills
            </Label>
            <Textarea id="skills-edit" value={skills} onChange={(e) => setSkills(e.target.value)} className="col-span-3" placeholder="Billing, Technical, Sales (comma-separated)" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateAgent}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAgentAlert({ agentId, onAgentDelete, children }: { agentId: string, onAgentDelete: (id: string) => void, children: React.ReactNode }) {
  const { toast } = useToast();

  const handleDelete = () => {
    onAgentDelete(agentId);
    toast({
      title: "Agent Deleted",
      description: `The agent has been removed from the team.`,
      variant: 'destructive'
    });
  }

  return (
     <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the agent
            and remove them from your records.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
            Yes, delete agent
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const { toast } = useToast();

  const handleAgentAdd = (newAgent: Agent) => {
    setAgents(prev => [newAgent, ...prev]);
  };

  const handleAgentUpdate = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
  };
  
  const handleAgentDelete = (agentId: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== agentId));
  };

  const handleSendAlert = (agentName: string) => {
    toast({
      title: 'Alert Sent',
      description: `An alert has been sent to ${agentName}.`,
    });
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
          <Card key={agent.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
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
            <CardContent className="p-4 pt-2 space-y-3 flex-1">
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
             <CardFooter className="bg-muted/30 px-4 py-2 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => handleSendAlert(agent.name)}>
                    <Bell className="mr-2 h-4 w-4" />
                    Send Alert
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <EditAgentDialog agent={agent} onAgentUpdate={handleAgentUpdate}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                      </EditAgentDialog>
                      <DeleteAgentAlert agentId={agent.id} onAgentDelete={handleAgentDelete}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" />
                           <span>Delete</span>
                        </DropdownMenuItem>
                      </DeleteAgentAlert>
                  </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
