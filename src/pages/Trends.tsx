import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Music, TrendingUp, Users, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const trendData = [
  { week: 'Sem. 1', streams: 100000, listeners: 50000 },
  { week: 'Sem. 2', streams: 120000, listeners: 60000 },
  { week: 'Sem. 3', streams: 150000, listeners: 75000 },
  { week: 'Sem. 4', streams: 130000, listeners: 65000 },
  { week: 'Sem. 5', streams: 170000, listeners: 85000 },
  { week: 'Sem. 6', streams: 200000, listeners: 100000 },
];

const trendingTracks = [
  {
    id: "t1",
    title: "Dounia",
    artist: "Tibesti",
    genre: "Folk",
  },
  {
    id: "t2",
    title: "N'Djamena la nuit",
    artist: "Ramaji",
    genre: "Musique urbaine",
  },
  {
    id: "t3",
    title: "Terre du Tchad",
    artist: "Rocky La Citadelle",
    genre: "Musique traditionnelle",
  },
];

const Trends = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Tendances musicales</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Trend Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Titre le plus tendance"
                  value="Dounia"
                  change="Folk - Tibesti"
                  icon={Music}
                  trend="up"
                />
                <StatsCard
                  title="Artiste en plus forte hausse"
                  value="Ramaji"
                  change="+200K auditeurs la semaine dernière"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="Genre tendance"
                  value="Musique urbaine"
                  change="+15 % de popularité ce mois-ci"
                  icon={TrendingUp}
                  trend="up"
                />
                <StatsCard
                  title="Coup de cœur"
                  value="Nouveau talent à l'honneur"
                  change="Décerné à Rocky La Citadelle"
                  icon={Award}
                  trend="up"
                />
              </div>

              {/* Trend Charts */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Tendance hebdomadaire</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Évolution des écoutes et auditeurs sur les 6 dernières semaines.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="week" 
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
                        dataKey="listeners"
                        stroke="hsl(var(--foreground))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
                        name="Auditeurs"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trending Tracks/Artists Section */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Tendance en ce moment</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Découvrez les titres les plus écoutés du moment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="grid gap-4">
                      {trendingTracks.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarFallback>{track.title.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{track.title}</p>
                            <p className="text-sm text-muted-foreground">{track.artist} - {track.genre}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Trends;
