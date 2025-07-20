"use client";

import { useState } from 'react';
import { Search, Mail, MessageSquare, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockTickets, mockAgents } from '@/lib/mock-data';
import type { Ticket, Agent, TicketPriority, TicketChannel } from '@/lib/types';
import { format } from 'date-fns';
import { PageHeader } from '@/components/page-header';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
      id: `ticket-${Math.floor(Math.random() * 1000)}`,
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
    
    // Reset form
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

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleTicketCreate = (newTicket: Ticket) => {
    setTickets(prev => [newTicket, ...prev]);
    // Switch to all tickets tab to see the newly created ticket
    setActiveTab('all');
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAgentName = (agentId?: string) => {
    if (!agentId) return 'Unassigned';
    return agents.find(a => a.id === agentId)?.name ?? 'Unknown Agent';
  };

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
          <TabsTrigger value="WHATSAPP" className="hidden sm:flex"><MessageSquare className="mr-2 h-4 w-4" />Whatsapp</TabsTrigger>
          <TabsTrigger value="CHAT" className="hidden sm:flex"><MessageSquare className="mr-2 h-4 w-4" />Chat</TabsTrigger>
          <TabsTrigger value="PHONE" className="hidden sm:flex"><Phone className="mr-2 h-4 w-4" />Phone</TabsTrigger>
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
                    <TableRow key={ticket.id}>
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
        <TabsContent value="EMAIL" className="mt-4">
            <TicketCreationForm channel="EMAIL" onTicketCreate={handleTicketCreate} />
        </TabsContent>
        <TabsContent value="WHATSAPP" className="mt-4">
            <TicketCreationForm channel="WHATSAPP" onTicketCreate={handleTicketCreate} />
        </TabsContent>
        <TabsContent value="CHAT" className="mt-4">
            <TicketCreationForm channel="CHAT" onTicketCreate={handleTicketCreate} />
        </TabsContent>
        <TabsContent value="PHONE" className="mt-4">
            <TicketCreationForm channel="PHONE" onTicketCreate={handleTicketCreate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
