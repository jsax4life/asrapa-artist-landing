import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Janv.", streams: 0, plays: 0 },
  { month: "Févr.", streams: 0, plays: 0 },
  { month: "Mars", streams: 0, plays: 0 },
  { month: "Avr.", streams: 0, plays: 0 },
  { month: "Mai", streams: 0, plays: 0 },
  { month: "Juin", streams: 0, plays: 0 },
  { month: "Juil.", streams: 0, plays: 0 },
];

export function PerformanceChart() {
  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Aperçu des performances</CardTitle>
        <CardDescription className="text-muted-foreground">
          Écoutes et lectures des 7 derniers mois
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
              name="Écoutes"
            />
            <Line
              type="monotone"
              dataKey="plays"
              stroke="hsl(var(--foreground))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
              name="Lectures"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}