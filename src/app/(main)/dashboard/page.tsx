"use client"

import { Clock, Download, FolderOpen, ShieldCheck, Ticket as TicketIcon, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, PieChart, Bar, Pie, YAxis, XAxis, CartesianGrid } from "recharts";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";

const ticketsByChannelData = [
  { channel: 'Email', tickets: 45, fill: 'var(--color-email)' },
  { channel: 'Chat', tickets: 78, fill: 'var(--color-chat)' },
  { channel: 'Phone', tickets: 32, fill: 'var(--color-phone)' },
  { channel: 'Whatsapp', tickets: 55, fill: 'var(--color-whatsapp)' },
  { channel: 'Web Form', tickets: 21, fill: 'var(--color-webform)' },
];

const ticketsByPriorityData = [
  { priority: 'Low', count: 120, fill: 'var(--color-low)' },
  { priority: 'Medium', count: 200, fill: 'var(--color-medium)' },
  { priority: 'High', count: 150, fill: 'var(--color-high)' },
  { priority: 'Urgent', count: 75, fill: 'var(--color-urgent)' },
];

const ticketsByChannelChartConfig: ChartConfig = {
  tickets: { label: 'Tickets' },
  email: { label: 'Email', color: 'hsl(var(--chart-1))' },
  chat: { label: 'Chat', color: 'hsl(var(--chart-2))' },
  phone: { label: 'Phone', color: 'hsl(var(--chart-3))' },
  whatsapp: { label: 'Whatsapp', color: 'hsl(var(--chart-4))' },
  webform: { label: 'Web Form', color: 'hsl(var(--chart-5))' },
};

const ticketsByPriorityChartConfig: ChartConfig = {
  count: { label: 'Count' },
  low: { label: 'Low', color: 'hsl(var(--chart-1))' },
  medium: { label: 'Medium', color: 'hsl(var(--chart-2))' },
  high: { label: 'High', color: 'hsl(var(--chart-3))' },
  urgent: { label: 'Urgent', color: 'hsl(var(--chart-4))' },
};

export default function DashboardPage() {
  const { toast } = useToast();

  const handleExport = (type: 'CSV' | 'PDF') => {
    toast({
      title: `Exporting Dashboard Data`,
      description: `Your dashboard data is being exported as a ${type} file. This may take a moment.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your customer support performance."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('CSV')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('PDF')}>
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,402</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">231</div>
            <p className="text-xs text-muted-foreground">Currently active and unassigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4h 32m</div>
            <p className="text-xs text-muted-foreground">-2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <p className="text-xs text-muted-foreground">+1.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tickets by Channel</CardTitle>
            <CardDescription>Distribution of tickets across different channels.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={ticketsByChannelChartConfig} className="h-[300px] w-full">
              <BarChart data={ticketsByChannelData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="channel" type="category" tickLine={false} axisLine={false} tickMargin={10} />
                <XAxis dataKey="tickets" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="tickets" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Breakdown of tickets by their priority level.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ChartContainer config={ticketsByPriorityChartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={ticketsByPriorityData} dataKey="count" nameKey="priority" innerRadius={60} strokeWidth={5} />
                <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
