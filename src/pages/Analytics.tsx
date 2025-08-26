import React from 'react';
import { Play, Users, DollarSign, Eye } from "lucide-react";
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const analyticsChartData = [
  { month: "Jan", revenue: 1200, streams: 45000 },
  { month: "Feb", revenue: 1500, streams: 52000 },
  { month: "Mar", revenue: 1300, streams: 48000 },
  { month: "Apr", revenue: 1800, streams: 67000 },
  { month: "May", revenue: 2000, streams: 73000 },
  { month: "Jun", revenue: 2500, streams: 89000 },
  { month: "Jul", revenue: 2700, streams: 95000 },
];

const Analytics = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Analytics Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Revenue"
                  value="$12.5K"
                  change="+15.2% from last month"
                  icon={DollarSign}
                  trend="up"
                />
                <StatsCard
                  title="Total Streams"
                  value="2.4M"
                  change="+12.5% from last month"
                  icon={Play}
                  trend="up"
                />
                <StatsCard
                  title="Unique Listeners"
                  value="350K"
                  change="+7.8% from last month"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="Page Views"
                  value="500K"
                  change="+10.1% from last month"
                  icon={Eye}
                  trend="up"
                />
              </div>

              {/* Overall Performance Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Overall Performance</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Monthly revenue and streams for the last 7 months
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
                        label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="hsl(var(--accent))" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ value: 'Streams', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
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
                        name="Revenue"
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="streams" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                        name="Streams"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Additional Analytics Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Top Tracks/Albums</CardTitle>
                    <CardDescription className="text-muted-foreground">Your most popular content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for top tracks/albums list */}
                    <p className="text-muted-foreground">Details about top performing tracks and albums will go here.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Geographic Distribution</CardTitle>
                    <CardDescription className="text-muted-foreground">Where your audience is located.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for geographic distribution map/data */}
                    <p className="text-muted-foreground">Map or data visualizing listener locations will go here.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Listener Demographics</CardTitle>
                    <CardDescription className="text-muted-foreground">Insights into your audience's age and gender.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for listener demographics data */}
                    <p className="text-muted-foreground">Charts and data about listener demographics will go here.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Engagement Metrics</CardTitle>
                    <CardDescription className="text-muted-foreground">How listeners interact with your music.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for engagement metrics data */}
                    <p className="text-muted-foreground">Data on skips, saves, and shares will go here.</p>
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
