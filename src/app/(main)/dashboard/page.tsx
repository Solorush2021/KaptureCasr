
"use client"

import { Clock, Download, Ticket as TicketIcon, ChevronDown, Smile, TrendingUp, RefreshCcw, BarChart2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { mockTickets } from "@/lib/mock-data";

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

function downloadCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    return;
  }

  const replacer = (key: string, value: any) => value === null ? '' : value;
  const header = Object.keys(data[0]);
  let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
  csv.unshift(header.join(','));
  const csvArray = csv.join('\r\n');

  const blob = new Blob([csvArray], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export default function DashboardPage() {
  const { toast } = useToast();

  const handleExport = (type: 'CSV' | 'PDF') => {
    if (type === 'CSV') {
      toast({
        title: `Exporting Ticket Data`,
        description: `Your ticket data is being exported as a CSV file.`,
      });
      downloadCSV(mockTickets, 'kapture-tickets-export.csv');
    } else if (type === 'PDF') {
      toast({
        title: `Feature Coming Soon`,
        description: `PDF export functionality is currently in development.`,
        variant: 'default',
      });
    }
  };

  const handleChartAction = (action: string, chartName: string) => {
    toast({
        title: `Chart Action: ${action}`,
        description: `Simulating '${action}' for the ${chartName} chart.`,
    });
  }

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
            <CardTitle className="text-sm font-medium">Tickets Solved Today</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground">-5% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.8%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-xs text-muted-foreground">Trending upwards</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Tickets by Channel</CardTitle>
            <CardDescription>Distribution of tickets across different channels.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 flex-1">
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
           <CardFooter className="border-t p-4 justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleChartAction('Refresh Data', 'Tickets by Channel')}>
                    <RefreshCcw className="mr-2 h-4 w-4"/>
                    Refresh Data
                </Button>
                 <Button variant="outline" size="sm" onClick={() => handleChartAction('View Report', 'Tickets by Channel')}>
                    <BarChart2 className="mr-2 h-4 w-4"/>
                    View Report
                </Button>
            </CardFooter>
        </Card>
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
            <CardDescription>Breakdown of tickets by their priority level.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center flex-1">
            <ChartContainer config={ticketsByPriorityChartConfig} className="h-[300px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={ticketsByPriorityData} dataKey="count" nameKey="priority" innerRadius={60} strokeWidth={5} />
                <ChartLegend content={<ChartLegendContent nameKey="priority" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="border-t p-4 justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleChartAction('Refresh Data', 'Tickets by Priority')}>
                    <RefreshCcw className="mr-2 h-4 w-4"/>
                    Refresh Data
                </Button>
                 <Button variant="outline" size="sm" onClick={() => handleChartAction('View Report', 'Tickets by Priority')}>
                    <BarChart2 className="mr-2 h-4 w-4"/>
                    View Report
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
