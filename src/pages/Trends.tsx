import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Music, TrendingUp, Users, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const demoTrendData = [
  { week: 1, streams: 100000, listeners: 50000 },
  { week: 2, streams: 120000, listeners: 60000 },
  { week: 3, streams: 150000, listeners: 75000 },
  { week: 4, streams: 130000, listeners: 65000 },
  { week: 5, streams: 170000, listeners: 85000 },
  { week: 6, streams: 200000, listeners: 100000 },
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
  const { t } = useTranslation();

  const trendData = demoTrendData.map((d) => ({
    week: t('trendsPage.weeklyTrend.weekLabel', { count: d.week }),
    streams: d.streams,
    listeners: d.listeners,
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('trendsPage.header.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Trend Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title={t('trendsPage.stats.topTrackTitle')}
                  value="Dounia"
                  change="Folk - Tibesti"
                  icon={Music}
                  trend="up"
                />
                <StatsCard
                  title={t('trendsPage.stats.risingArtistTitle')}
                  value="Ramaji"
                  change={t('trendsPage.stats.risingArtistChange')}
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title={t('trendsPage.stats.trendingGenreTitle')}
                  value="Musique urbaine"
                  change={t('trendsPage.stats.trendingGenreChange')}
                  icon={TrendingUp}
                  trend="up"
                />
                <StatsCard
                  title={t('trendsPage.stats.featuredTalentTitle')}
                  value={t('trendsPage.stats.featuredTalentValue')}
                  change={t('trendsPage.stats.featuredTalentChange', { artist: 'Rocky La Citadelle' })}
                  icon={Award}
                  trend="up"
                />
              </div>

              {/* Trend Charts */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('trendsPage.weeklyTrend.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('trendsPage.weeklyTrend.description')}
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
                        name={t('trendsPage.weeklyTrend.streamsLabel')}
                      />
                      <Line
                        type="monotone"
                        dataKey="listeners"
                        stroke="hsl(var(--foreground))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--foreground))', strokeWidth: 2, r: 4 }}
                        name={t('trendsPage.weeklyTrend.listenersLabel')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trending Tracks/Artists Section */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('trendsPage.trendingNow.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('trendsPage.trendingNow.description')}
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
