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
  { name: 'Hommes', value: 500, color: 'hsl(0 85% 60%)' },
  { name: 'Femmes', value: 300, color: 'hsl(0 0% 96%)' },
  { name: 'Autre', value: 200, color: 'hsl(355 75% 42%)' },
];

const Audience = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Aperçu de l'audience</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Audience Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Auditeurs totaux"
                  value="1.2M"
                  change="+8,5 % vs mois dernier"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="Nouveaux auditeurs"
                  value="150K"
                  change="+10,2 % vs mois dernier"
                  icon={UserPlus}
                  trend="up"
                />
                <StatsCard
                  title="Auditeurs fidèles"
                  value="800K"
                  change="+5,1 % vs mois dernier"
                  icon={UserCheck}
                  trend="up"
                />
                <StatsCard
                  title="Taux d'engagement"
                  value="75 %"
                  change="+3,0 % d'amélioration"
                  icon={Heart}
                  trend="up"
                />
              </div>

              {/* Demographics & Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">Démographie de l'audience</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Répartition par âge et par genre de votre audience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Répartition par âge</h3>
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
                      <h3 className="text-lg font-semibold text-foreground mb-2">Répartition par genre</h3>
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
                    <CardTitle className="text-xl font-bold text-foreground">Répartition géographique</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Principales villes où votre musique est écoutée.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>N'Djaména : 45 %</li>
                      <li>Moundou : 15 %</li>
                      <li>Sarh : 10 %</li>
                      <li>Diaspora (France) : 8 %</li>
                      <li>Diaspora (autres pays) : 7 %</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Listener Activity Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Activité des auditeurs</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Auditeurs actifs quotidiens sur le dernier mois.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { day: 'Jour 1', listeners: 12000 },
                      { day: 'Jour 5', listeners: 15000 },
                      { day: 'Jour 10', listeners: 13000 },
                      { day: 'Jour 15', listeners: 18000 },
                      { day: 'Jour 20', listeners: 16000 },
                      { day: 'Jour 25', listeners: 20000 },
                      { day: 'Jour 30', listeners: 19000 },
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
                      <Bar dataKey="listeners" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Source of Listeners */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Origine des auditeurs</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Comment les auditeurs découvrent votre musique.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Direct : 30 %</li>
                    <li>Réseaux sociaux : 25 %</li>
                    <li>Playlists : 20 %</li>
                    <li>Recherche : 15 %</li>
                    <li>Autre : 10 %</li>
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
