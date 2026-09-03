import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function PerformanceChart() {
  const { t } = useTranslation();

  const chartData = [
    { month: t('dashboardHome.performanceChart.months.jan'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.feb'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.mar'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.apr'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.may'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.jun'), streams: 0, plays: 0 },
    { month: t('dashboardHome.performanceChart.months.jul'), streams: 0, plays: 0 },
  ];

  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{t('dashboardHome.performanceChart.title')}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {t('dashboardHome.performanceChart.description')}
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
              name={t('dashboardHome.performanceChart.streamsLegend')}
            />
            <Line
              type="monotone"
              dataKey="plays"
              stroke="hsl(var(--foreground))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
              name={t('dashboardHome.performanceChart.playsLegend')}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}