import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserCheck, Heart } from "lucide-react";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const demoDemographicsData = [
  { name: '18-24', listeners: 400 },
  { name: '25-34', listeners: 300 },
  { name: '35-44', listeners: 200 },
  { name: '45+', listeners: 100 },
];

const demoGenderData = [
  { name: 'Male', value: 500, color: '#0088FE' },
  { name: 'Female', value: 300, color: '#00C49F' },
  { name: 'Other', value: 200, color: '#FFBB28' },
];

const Audience = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Audience Overview</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Audience Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Listeners"
                  value="1.2M"
                  change="+8.5% from last month"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="New Listeners"
                  value="150K"
                  change="+10.2% from last month"
                  icon={UserPlus}
                  trend="up"
                />
                <StatsCard
                  title="Returning Listeners"
                  value="800K"
                  change="+5.1% from last month"
                  icon={UserCheck}
                  trend="up"
                />
                <StatsCard
                  title="Engagement Rate"
                  value="75%"
                  change="+3.0% improvement"
                  icon={Heart}
                  trend="up"
                />
              </div>

              {/* Demographics & Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">Audience Demographics</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Insights into your audience's age and gender distribution.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Age Distribution</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={demoDemographicsData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--popover-foreground))',
                            }}
                          />
                          <Bar dataKey="listeners" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Gender Distribution</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={demoGenderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {demoGenderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--popover))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              color: 'hsl(var(--popover-foreground))',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-4 mt-2">
                        {demoGenderData.map((entry, index) => (
                          <div key={`legend-${index}`} className="flex items-center text-sm text-muted-foreground">
                            <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></span>
                            {entry.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">Geographic Distribution</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Top countries and cities where your music is heard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Placeholder for geographic data */}
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>United States: 40%</li>
                      <li>Canada: 15%</li>
                      <li>United Kingdom: 10%</li>
                      <li>Germany: 8%</li>
                      <li>Australia: 7%</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Listener Activity Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Listener Activity</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Daily active listeners over the last month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { day: 'Day 1', listeners: 12000 },
                      { day: 'Day 5', listeners: 15000 },
                      { day: 'Day 10', listeners: 13000 },
                      { day: 'Day 15', listeners: 18000 },
                      { day: 'Day 20', listeners: 16000 },
                      { day: 'Day 25', listeners: 20000 },
                      { day: 'Day 30', listeners: 19000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} axisLine={{ stroke: 'hsl(var(--border))' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--popover-foreground))',
                        }}
                      />
                      <Bar dataKey="listeners" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Source of Listeners */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Source of Listeners</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    How listeners are discovering your music.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Direct: 30%</li>
                    <li>Social Media: 25%</li>
                    <li>Playlists: 20%</li>
                    <li>Search: 15%</li>
                    <li>Other: 10%</li>
                  </ul>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Audience;
