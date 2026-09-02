import React from 'react';
import { Play, Users, DollarSign, Eye } from "lucide-react";
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const analyticsChartData = [
  { month: "Janv.", revenue: 780000, streams: 45000 },
  { month: "Févr.", revenue: 975000, streams: 52000 },
  { month: "Mars", revenue: 845000, streams: 48000 },
  { month: "Avr.", revenue: 1170000, streams: 67000 },
  { month: "Mai", revenue: 1300000, streams: 73000 },
  { month: "Juin", revenue: 1625000, streams: 89000 },
  { month: "Juil.", revenue: 1755000, streams: 95000 },
];

const Analytics = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Aperçu analytique</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Analytics Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Revenus totaux"
                  value="8,1M FCFA"
                  change="+15,2 % vs mois dernier"
                  icon={DollarSign}
                  trend="up"
                />
                <StatsCard
                  title="Écoutes totales"
                  value="2.4M"
                  change="+12,5 % vs mois dernier"
                  icon={Play}
                  trend="up"
                />
                <StatsCard
                  title="Auditeurs uniques"
                  value="350K"
                  change="+7,8 % vs mois dernier"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="Vues de page"
                  value="500K"
                  change="+10,1 % vs mois dernier"
                  icon={Eye}
                  trend="up"
                />
              </div>

              {/* Overall Performance Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Performance globale</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Revenus et écoutes des 7 derniers mois
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
                        label={{ value: 'Revenus', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                        label={{ value: 'Écoutes', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
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
                        name="Revenus"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="streams"
                        stroke="hsl(var(--foreground))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
                        name="Écoutes"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Additional Analytics Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Titres/Albums les plus écoutés</CardTitle>
                    <CardDescription className="text-muted-foreground">Votre contenu le plus populaire.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Ce détail sera disponible dès que vous aurez des écoutes.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Répartition géographique</CardTitle>
                    <CardDescription className="text-muted-foreground">Où se trouve votre audience.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">La carte de vos auditeurs s'affichera ici dès le lancement.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Démographie des auditeurs</CardTitle>
                    <CardDescription className="text-muted-foreground">Âge et genre de votre audience.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Ces statistiques s'afficheront ici dès que vous aurez des auditeurs.</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground">Indicateurs d'engagement</CardTitle>
                    <CardDescription className="text-muted-foreground">Comment les auditeurs interagissent avec votre musique.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Les données sur les partages et favoris s'afficheront ici.</p>
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
