import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Users, DollarSign, Eye } from "lucide-react";
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const { t } = useTranslation();

  const analyticsChartData = [
    { month: t('analyticsPage.chart.months.jan'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.feb'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.mar'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.apr'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.may'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.jun'), revenue: 0, streams: 0 },
    { month: t('analyticsPage.chart.months.jul'), revenue: 0, streams: 0 },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('analyticsPage.header.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Analytics Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title={t('analyticsPage.stats.totalRevenue')}
                  value="0 FCFA"
                  icon={DollarSign}
                  trend="neutral"
                />
                <StatsCard
                  title={t('analyticsPage.stats.totalStreams')}
                  value="0"
                  icon={Play}
                  trend="neutral"
                />
                <StatsCard
                  title={t('analyticsPage.stats.uniqueListeners')}
                  value="0"
                  icon={Users}
                  trend="neutral"
                />
                <StatsCard
                  title={t('analyticsPage.stats.pageViews')}
                  value="0"
                  icon={Eye}
                  trend="neutral"
                />
              </div>

              {/* Overall Performance Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('analyticsPage.performance.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('analyticsPage.performance.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="hsl(var(--primary))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ value: t('analyticsPage.chart.revenueLabel'), angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ value: t('analyticsPage.chart.streamsLabel'), angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
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
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        name={t('analyticsPage.chart.revenueLabel')}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="streams"
                        stroke="hsl(var(--foreground))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
                        name={t('analyticsPage.chart.streamsLabel')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Additional Analytics Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">{t('analyticsPage.topContent.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t('analyticsPage.topContent.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('analyticsPage.topContent.empty')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">{t('analyticsPage.geo.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t('analyticsPage.geo.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('analyticsPage.geo.empty')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">{t('analyticsPage.demographics.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t('analyticsPage.demographics.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('analyticsPage.demographics.empty')}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">{t('analyticsPage.engagement.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">{t('analyticsPage.engagement.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('analyticsPage.engagement.empty')}</p>
                  </CardContent>
                </Card>
              </div>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Analytics;
