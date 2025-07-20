// route-ticket.ts
'use server';

/**
 * @fileOverview A flow for intelligently routing tickets to agents based on ticket content and agent skills.
 *
 * - routeTicket - A function that routes a ticket to an appropriate agent.
 * - RouteTicketInput - The input type for the routeTicket function.
 * - RouteTicketOutput - The return type for the routeTicket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RouteTicketInputSchema = z.object({
  ticketDetails: z.string().describe('The details of the ticket, including description, priority, and channel.'),
  agentSkills: z.array(z.string()).describe('A list of skills possessed by available agents.'),
});
export type RouteTicketInput = z.infer<typeof RouteTicketInputSchema>;

const RouteTicketOutputSchema = z.object({
  assignedAgent: z.string().describe('The ID of the agent to whom the ticket is assigned, or null if no suitable agent is found.'),
  reason: z.string().describe('The reason for assigning the ticket to the agent.'),
});
export type RouteTicketOutput = z.infer<typeof RouteTicketOutputSchema>;

export async function routeTicket(input: RouteTicketInput): Promise<RouteTicketOutput> {
  return routeTicketFlow(input);
}

const routeTicketPrompt = ai.definePrompt({
  name: 'routeTicketPrompt',
  input: {
    schema: RouteTicketInputSchema,
  },
  output: {
    schema: RouteTicketOutputSchema,
  },
  prompt: `Given the following ticket details and available agent skills, determine the most suitable agent to assign the ticket to.

Ticket Details: {{{ticketDetails}}}

Available Agent Skills: {{#each agentSkills}}{{{this}}}, {{/each}}

Consider the ticket's content, priority, and required skills.  Prioritize agents with the most relevant skills and the lowest current workload.

Return the ID of the assigned agent and the reason for the assignment. If no suitable agent is found, return null for the agent ID and provide a reason.

Ensure the output is valid JSON.`, 
});

const routeTicketFlow = ai.defineFlow(
  {
    name: 'routeTicketFlow',
    inputSchema: RouteTicketInputSchema,
    outputSchema: RouteTicketOutputSchema,
  },
  async input => {
    const {output} = await routeTicketPrompt(input);
    return output!;
  }
);
