import type { Ticket, Agent } from './types';

export const mockAgents: Agent[] = [
  { id: 'agent-1', name: 'Alice Johnson', email: 'alice@kapture.cx', status: 'ONLINE', skillTags: ['Billing', 'Refunds'], maxConcurrentTickets: 3, avatarUrl: 'https://placehold.co/100x100' },
  { id: 'agent-2', name: 'Bob Williams', email: 'bob@kapture.cx', status: 'ONLINE', skillTags: ['Technical Support', 'Pre-Sales'], maxConcurrentTickets: 5, avatarUrl: 'https://placehold.co/100x100' },
  { id: 'agent-3', name: 'Charlie Brown', email: 'charlie@kapture.cx', status: 'BUSY', skillTags: ['Billing', 'Technical Support'], maxConcurrentTickets: 4, avatarUrl: 'https://placehold.co/100x100' },
  { id: 'agent-4', name: 'Diana Miller', email: 'diana@kapture.cx', status: 'OFFLINE', skillTags: ['Refunds', 'Pre-Sales'], maxConcurrentTickets: 5, avatarUrl: 'https://placehold.co/100x100' },
];

export const mockTickets: Ticket[] = [
  { id: 'ticket-001', title: 'Cannot access my account', description: 'I am unable to log in to my account. It says invalid credentials but I am sure they are correct.', priority: 'HIGH', channel: 'EMAIL', status: 'ASSIGNED', agentId: 'agent-2', createdAt: new Date('2023-10-26T10:00:00Z'), updatedAt: new Date('2023-10-26T10:05:00Z') },
  { id: 'ticket-002', title: 'Question about billing', description: 'I have a question regarding my last invoice. There seems to be an extra charge.', priority: 'MEDIUM', channel: 'CHAT', status: 'ASSIGNED', agentId: 'agent-1', createdAt: new Date('2023-10-26T11:20:00Z'), updatedAt: new Date('2023-10-26T11:22:00Z') },
  { id: 'ticket-003', title: 'Product is not working', description: 'The product I bought last week stopped working. I need technical assistance.', priority: 'URGENT', channel: 'PHONE', status: 'OPEN', createdAt: new Date('2023-10-27T09:00:00Z'), updatedAt: new Date('2023-10-27T09:00:00Z') },
  { id: 'ticket-004', title: 'Pre-sales inquiry', description: 'I want to know more about your enterprise plan features.', priority: 'LOW', channel: 'WEB_FORM', status: 'PENDING_AGENT_REPLY', agentId: 'agent-2', createdAt: new Date('2023-10-27T14:30:00Z'), updatedAt: new Date('2023-10-27T14:30:00Z') },
  { id: 'ticket-005', title: 'Refund request for order #5829', description: 'I would like to request a refund for my recent order.', priority: 'MEDIUM', channel: 'EMAIL', status: 'RESOLVED', agentId: 'agent-4', createdAt: new Date('2023-10-25T15:00:00Z'), updatedAt: new Date('2023-10-25T18:30:00Z') },
  { id: 'ticket-006', title: 'Password Reset', description: 'I forgot my password and the reset link is not working.', priority: 'HIGH', channel: 'WHATSAPP', status: 'OPEN', createdAt: new Date('2023-10-28T08:00:00Z'), updatedAt: new Date('2023-10-28T08:00:00Z') },
];
