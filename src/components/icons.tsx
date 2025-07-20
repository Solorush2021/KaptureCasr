import { type LucideProps, BotMessageSquare, BarChart, Ticket, Users, Route } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => (
    <BotMessageSquare {...props} />
  ),
  Dashboard: BarChart,
  Tickets: Ticket,
  Agents: Users,
  Routing: Route,
};
