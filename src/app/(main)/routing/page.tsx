
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, Send, PlusCircle, Trash2, ShieldQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { mockAgents } from '@/lib/mock-data';
import { routeTicket } from './actions';
import type { RouteTicketOutput } from '@/ai/flows/route-ticket';
import { PageHeader } from '@/components/page-header';
import { Separator } from '@/components/ui/separator';
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

const allSkills = Array.from(new Set(mockAgents.flatMap(agent => agent.skillTags)));

const formSchema = z.object({
  ticketDetails: z.string().min(10, { message: "Ticket details must be at least 10 characters." }),
  agentSkills: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one skill.',
  }),
});

type Rule = {
  id: string;
  keyword: string;
  action: string;
};

const initialRules: Rule[] = [
    { id: 'rule-1', keyword: 'payment failed', action: 'Set Priority to URGENT' },
    { id: 'rule-2', keyword: 'refund', action: 'Assign to Billing skill' },
    { id: 'rule-3', keyword: 'cannot login', action: 'Set Priority to HIGH' },
];

function AddRuleDialog({ onRuleAdd }: { onRuleAdd: (rule: Rule) => void }) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [action, setAction] = useState('');
  const { toast } = useToast();

  const handleAddRule = () => {
    if (!keyword || !action) {
      toast({
        title: "Validation Error",
        description: "Keyword and action are required.",
        variant: "destructive",
      });
      return;
    }

    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      keyword,
      action,
    };

    onRuleAdd(newRule);
    toast({
      title: "Rule Added",
      description: "The new routing rule has been saved.",
    });
    setOpen(false);
    setKeyword('');
    setAction('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
            <PlusCircle className="mr-2" /> Add Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Rule</DialogTitle>
          <DialogDescription>
            Define a keyword and the action to be taken when it's found.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="keyword" className="text-right">
              Keyword
            </Label>
            <Input id="keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="col-span-3" placeholder="e.g., refund" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="action" className="text-right">
              Action
            </Label>
            <Input id="action" value={action} onChange={(e) => setAction(e.target.value)} className="col-span-3" placeholder="e.g., Set Priority to HIGH" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddRule}>Add Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


export default function RoutingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RouteTicketOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rules, setRules] = useState<Rule[]>(initialRules);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticketDetails: 'A customer is reporting that their payment failed for their monthly subscription. They are on the Pro plan and are concerned about losing service. This should be treated as a high priority billing issue.',
      agentSkills: allSkills,
    },
  });

  const handleRuleAdd = (newRule: Rule) => {
    setRules(prev => [...prev, newRule]);
  };

  const handleRuleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      // Simple rule application simulation before sending to AI
      let processedTicketDetails = values.ticketDetails;
      rules.forEach(rule => {
        if (processedTicketDetails.toLowerCase().includes(rule.keyword.toLowerCase())) {
          console.log(`Applying rule: ${rule.action}`);
          // In a real app, this would modify the ticket object.
          // For now, we'll just log it. The AI will see the original text.
        }
      });

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
        description="Use a combination of a rules engine and GenAI to automatically assign tickets."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
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
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
        </div>
        
        <div className="lg:col-span-2 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Routing Rules Engine</CardTitle>
                    <CardDescription>Define rules that run before AI analysis.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div className="text-sm">
                                <span className="font-semibold uppercase text-muted-foreground">IF</span> keyword is <span className="font-mono text-primary">"{rule.keyword}"</span>, <span className="font-semibold uppercase text-muted-foreground">THEN</span> {rule.action}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleRuleDelete(rule.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    <AddRuleDialog onRuleAdd={handleRuleAdd} />
                </CardContent>
            </Card>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Routing Result</h3>
                {isLoading && (
                  <Card className="flex h-full min-h-[220px] items-center justify-center p-8">
                    <div className="text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                      <p className="mt-4">Applying rules and finding the best agent...</p>
                    </div>
                  </Card>
                )}
                {error && (
                  <Card className="border-destructive bg-destructive/10 p-4 min-h-[220px]">
                    <CardTitle className="text-destructive">Error</CardTitle>
                    <CardDescription className="text-destructive">{error}</CardDescription>
                  </Card>
                )}
                {result && (
                  <Card className="bg-primary/5 min-h-[220px]">
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
                  <Card className="flex h-full min-h-[220px] items-center justify-center p-8 text-center border-dashed">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ShieldQuestion className="h-8 w-8" />
                        <p>The routing result will be displayed here.</p>
                      </div>
                  </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
