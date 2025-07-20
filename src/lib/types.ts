export type TicketStatus = "OPEN" | "PENDING_AGENT_REPLY" | "PENDING_CUSTOMER_REPLY" | "ASSIGNED" | "RESOLVED" | "CLOSED" | "ESCALATED" | "ON_HOLD";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketChannel = "EMAIL" | "WHATSAPP" | "CHAT" | "PHONE" | "WEB_FORM";

export type Ticket = {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  channel: TicketChannel;
  status: TicketStatus;
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AgentStatus = "ONLINE" | "OFFLINE" | "BUSY" | "ON_BREAK";

export type Agent = {
  id: string;
  name: string;
  email: string;
  status: AgentStatus;
  skillTags: string[];
  maxConcurrentTickets: number;
  avatarUrl: string;
};
