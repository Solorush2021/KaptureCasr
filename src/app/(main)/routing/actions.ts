"use server";

import { routeTicket as routeTicketFlow } from '@/ai/flows/route-ticket';
import type { RouteTicketInput, RouteTicketOutput } from '@/ai/flows/route-ticket';

export async function routeTicket(input: RouteTicketInput): Promise<RouteTicketOutput> {
  try {
    const result = await routeTicketFlow(input);
    return result;
  } catch (error) {
    console.error("Error in routeTicket action:", error);
    throw new Error("Failed to route ticket due to a server error. Please check the API logs.");
  }
}
