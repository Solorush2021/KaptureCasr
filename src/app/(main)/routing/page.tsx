"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { mockAgents } from '@/lib/mock-data';
import { routeTicket } from './actions';
import type { RouteTicketOutput } from '@/ai/flows/route-ticket';
import { PageHeader } from '@/components/page-header';

const allSkills = Array.from(new Set(mockAgents.flatMap(agent => agent.skillTags)));

const formSchema = z.object({
  ticketDetails: z.string().min(10, { message: "Ticket details must be at least 10 characters." }),
  agentSkills: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one skill.',
  }),
});

export default function RoutingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RouteTicketOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketDetails: 'A customer is reporting that their payment failed for their monthly subscription. They are on the Pro plan and are concerned about losing service. This should be treated as a high priority billing issue.',
      agentSkills: allSkills,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await routeTicket(values);
      setResult(response);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Intelligent Ticket Routing"
        description="Use GenAI to automatically assign tickets to the best agent."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Route a Ticket</CardTitle>
                <CardDescription>Enter ticket details and select available agent skills to find the best match.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="ticketDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., High priority ticket about a billing issue. Customer is upset."
                          className="min-h-[120px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agentSkills"
                  render={() => (
                    <FormItem>
                      <FormLabel>Available Agent Skills</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {allSkills.map((skill) => (
                          <FormField
                            key={skill}
                            control={form.control}
                            name="agentSkills"
                            render={({ field }) => {
                              return (
                                <FormItem key={skill} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(skill)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, skill])
                                          : field.onChange(field.value?.filter((value) => value !== skill));
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm">{skill}</FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} size="lg">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Route Ticket
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Routing Result</h3>
            {isLoading && (
              <Card className="flex h-full min-h-[300px] items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  <p className="mt-4">Finding the best agent...</p>
                </div>
              </Card>
            )}
            {error && (
              <Card className="border-destructive bg-destructive/10 p-4 min-h-[300px]">
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription className="text-destructive">{error}</CardDescription>
              </Card>
            )}
            {result && (
              <Card className="bg-primary/5 min-h-[300px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-accent" />
                    Assignment Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">Assigned Agent</h4>
                    <p className="text-muted-foreground">{mockAgents.find(a => a.id === result.assignedAgent)?.name || result.assignedAgent || 'No suitable agent found'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Reason</h4>
                    <p className="text-muted-foreground">{result.reason}</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {!isLoading && !result && !error && (
              <Card className="flex h-full min-h-[300px] items-center justify-center p-8 text-center border-dashed">
                  <p className="text-muted-foreground">The routing result will be displayed here.</p>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
