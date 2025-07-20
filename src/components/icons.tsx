import { type LucideProps, BotMessageSquare, BarChart, Ticket, Users, Route, Settings, MonitorPlay } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <BotMessageSquare {...props} />
  ),
  Dashboard: BarChart,
  Tickets: Ticket,
  Agents: Users,
  Routing: Route,
  Settings: Settings,
  LiveView: MonitorPlay,
};
