import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", streams: 45000, plays: 32000 },
  { month: "Feb", streams: 52000, plays: 38000 },
  { month: "Mar", streams: 48000, plays: 35000 },
  { month: "Apr", streams: 67000, plays: 49000 },
  { month: "May", streams: 73000, plays: 54000 },
  { month: "Jun", streams: 89000, plays: 68000 },
  { month: "Jul", streams: 95000, plays: 74000 },
];

export function PerformanceChart() {
  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Performance Overview</CardTitle>
        <CardDescription className="text-muted-foreground">
          Monthly streams and plays for the last 7 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="streams" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              name="Streams"
            />
            <Line 
              type="monotone" 
              dataKey="plays" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
              name="Plays"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}