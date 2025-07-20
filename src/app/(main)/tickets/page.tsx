
"use client";

import { useState, useMemo } from 'react';
import { Search, Mail, MessageSquare, Phone, Send, X, Edit, Trash2, Ticket as TicketIcon, MessageCirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTickets, mockAgents } from '@/lib/mock-data';
import type { Ticket, Agent, TicketPriority, TicketChannel, TicketStatus } from '@/lib/types';
import { format } from 'date-fns';
import { PageHeader } from '@/components/page-header';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function AddNoteDialog({ ticketId, children }: { ticketId: string, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState('');
    const { toast } = useToast();

    const handleAddNote = () => {
        if (!note) {
            toast({ title: 'Note cannot be empty', variant: 'destructive' });
            return;
        }
        console.log(`Adding note to ticket ${ticketId}: ${note}`);
        toast({
            title: 'Internal Note Added',
            description: 'The note has been successfully added to the ticket.',
        });
        setNote('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Internal Note</DialogTitle>
                    <DialogDescription>
                        This note will only be visible to other agents.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Type your internal note here..."
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddNote}>Add Note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function TicketDetailsPanel({ ticket, agents, onTicketUpdate, onTicketDelete, open, onOpenChange }: { ticket: Ticket | null, agents: Agent[], onTicketUpdate: (t: Ticket) => void, onTicketDelete: (id: string) => void, open: boolean, onOpenChange: (open: boolean) => void }) {
  if (!ticket) return null;
  const { toast } = useToast();

  const handleUpdate = (field: keyof Ticket, value: any) => {
    const updatedTicket = { ...ticket, [field]: value, updatedAt: new Date() };
    onTicketUpdate(updatedTicket);
    toast({
      title: 'Ticket Updated',
      description: `Ticket ${ticket.id} has been updated.`,
    });
  };

  const handleDelete = () => {
    onTicketDelete(ticket.id);
    toast({
      title: 'Ticket Deleted',
      description: `Ticket ${ticket.id} has been deleted.`,
      variant: 'destructive',
    });
    onOpenChange(false);
  };
  
  const getAgentById = (agentId: string) => agents.find(a => a.id === agentId);
  const assignedAgent = ticket.agentId ? getAgentById(ticket.agentId) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TicketIcon className="h-6 w-6 text-primary"/>
            <span>{ticket.title}</span>
          </SheetTitle>
          <SheetDescription>
            ID: {ticket.id} | Channel: {ticket.channel}
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex-1 overflow-y-auto pr-6 space-y-6">
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select value={ticket.status} onValueChange={(value: TicketStatus) => handleUpdate('status', value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="PENDING_AGENT_REPLY">Pending Agent Reply</SelectItem>
                            <SelectItem value="PENDING_CUSTOMER_REPLY">Pending Customer Reply</SelectItem>
                            <SelectItem value="ASSIGNED">Assigned</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                            <SelectItem value="ESCALATED">Escalated</SelectItem>
                            <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
                 <div>
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <Select value={ticket.priority} onValueChange={(value: TicketPriority) => handleUpdate('priority', value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Assigned Agent</Label>
              <Select value={ticket.agentId || 'unassigned'} onValueChange={(value) => handleUpdate('agentId', value === 'unassigned' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign an agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {agents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {assignedAgent && (
                <Card className="bg-muted/50">
                    <CardHeader className="flex flex-row items-center gap-4 p-4">
                        <Avatar>
                            <AvatarImage src={assignedAgent.avatarUrl} alt={assignedAgent.name} data-ai-hint="person avatar" />
                            <AvatarFallback>{assignedAgent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{assignedAgent.name}</p>
                            <p className="text-xs text-muted-foreground">{assignedAgent.email}</p>
                        </div>
                    </CardHeader>
                </Card>
            )}

            <div className="text-xs text-muted-foreground space-y-2">
                <p>Created: {format(ticket.createdAt, 'PPP p')}</p>
                <p>Last Updated: {format(ticket.updatedAt, 'PPP p')}</p>
            </div>
        </div>
        <SheetFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-end sm:space-x-2">
            <AddNoteDialog ticketId={ticket.id}>
                 <Button variant="outline" className="w-full">
                    <MessageCirclePlus className="mr-2 h-4 w-4" /> Add Note
                </Button>
            </AddNoteDialog>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this ticket.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete ticket
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function TicketCreationForm({ channel, onTicketCreate }: { channel: TicketChannel, onTicketCreate: (ticket: Ticket) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const { toast } = useToast();

  const handleCreateTicket = () => {
    if (!title || !description) {
      toast({
        title: "Validation Error",
        description: "Please fill out title and description.",
        variant: "destructive",
      });
      return;
    }

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 900) + 100}`,
      title,
      description,
      priority,
      channel,
      status: 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onTicketCreate(newTicket);
    toast({
      title: 'Ticket Created!',
      description: `A new ${channel.toLowerCase()} ticket has been successfully created.`,
    });
    
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create {channel} Ticket</CardTitle>
        <CardDescription>Simulate a ticket coming from {channel}.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${channel}`}>Title</Label>
          <Input id={`title-${channel}`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`Title for ${channel} ticket`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`description-${channel}`}>Description</Label>
          <Textarea id={`description-${channel}`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Description for ${channel} ticket`} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`priority-${channel}`}>Priority</Label>
          <Select value={priority} onValueChange={(value: TicketPriority) => setPriority(value)}>
            <SelectTrigger id={`priority-${channel}`}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreateTicket}><Send className="mr-2" /> Create Ticket</Button>
      </CardContent>
    </Card>
  );
}

function ChannelTicketView({ channel, tickets, onTicketCreate, onRowClick, getAgentName }: { channel: TicketChannel, tickets: Ticket[], onTicketCreate: (ticket: Ticket) => void, onRowClick: (ticket: Ticket) => void, getAgentName: (id?: string) => string }) {
  const channelTickets = tickets.filter(t => t.channel === channel).slice(0, 10);
  
  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2">
        <TicketCreationForm channel={channel} onTicketCreate={onTicketCreate} />
      </div>
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent {channel} Tickets</CardTitle>
            <CardDescription>Showing the last 10 tickets from this channel.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelTickets.map((ticket) => (
                    <TableRow key={ticket.id} onClick={() => onRowClick(ticket)} className="cursor-pointer">
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'secondary' : ticket.status === 'ESCALATED' ? 'destructive' : 'default'}>{ticket.status}</Badge>
                      </TableCell>
                      <TableCell>{getAgentName(ticket.agentId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [agents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleTicketCreate = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
  };
  
  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    if (selectedTicket?.id === updatedTicket.id) {
        setSelectedTicket(updatedTicket);
    }
  };
  
  const handleTicketDelete = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };
  
  const handleRowClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsPanelOpen(true);
  };

  const filteredTickets = useMemo(() => {
    if (!searchTerm) return tickets;
    return tickets.filter(ticket =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tickets, searchTerm]);

  const getAgentName = (agentId?: string) => {
    if (!agentId) return 'Unassigned';
    return agents.find(a => a.id === agentId)?.name ?? 'Unknown Agent';
  };

  const channelTabs: { value: TicketChannel, icon: React.ReactNode, name: string }[] = [
      { value: 'EMAIL', icon: <Mail className="mr-2 h-4 w-4" />, name: 'Email' },
      { value: 'WHATSAPP', icon: <MessageSquare className="mr-2 h-4 w-4" />, name: 'Whatsapp' },
      { value: 'CHAT', icon: <MessageSquare className="mr-2 h-4 w-4" />, name: 'Chat' },
      { value: 'PHONE', icon: <Phone className="mr-2 h-4 w-4" />, name: 'Phone' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Tickets"
        description="Manage and track all customer support tickets."
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="EMAIL"><Mail className="mr-2 h-4 w-4" />Email</TabsTrigger>
          <TabsTrigger value="WHATSAPP"><MessageSquare className="mr-2 h-4 w-4" />Whatsapp</TabsTrigger>
          <TabsTrigger value="CHAT"><MessageSquare className="mr-2 h-4 w-4" />Chat</TabsTrigger>
          <TabsTrigger value="PHONE"><Phone className="mr-2 h-4 w-4" />Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <CardTitle>All Tickets</CardTitle>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id} onClick={() => handleRowClick(ticket)} className="cursor-pointer">
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.title}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? 'secondary' : ticket.status === 'ESCALATED' ? 'destructive' : 'default'}>{ticket.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ticket.priority === 'URGENT' ? 'destructive' : ticket.priority === 'HIGH' ? 'default' : 'secondary'}>{ticket.priority}</Badge>
                      </TableCell>
                      <TableCell>{ticket.channel}</TableCell>
                      <TableCell>{getAgentName(ticket.agentId)}</TableCell>
                      <TableCell>{format(ticket.createdAt, 'PP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {channelTabs.map(tab => (
           <TabsContent key={tab.value} value={tab.value} className="mt-4">
              <ChannelTicketView 
                channel={tab.value}
                tickets={tickets}
                onTicketCreate={handleTicketCreate}
                onRowClick={handleRowClick}
                getAgentName={getAgentName}
              />
           </TabsContent>
        ))}

      </Tabs>

       <TicketDetailsPanel
        ticket={selectedTicket}
        agents={agents}
        onTicketUpdate={handleTicketUpdate}
        onTicketDelete={handleTicketDelete}
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
      />
    </div>
  );
}
