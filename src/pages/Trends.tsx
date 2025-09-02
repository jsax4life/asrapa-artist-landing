import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { Music, TrendingUp, Users, Award } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const trendData = [
  { week: 'Week 1', streams: 100000, listeners: 50000 },
  { week: 'Week 2', streams: 120000, listeners: 60000 },
  { week: 'Week 3', streams: 150000, listeners: 75000 },
  { week: 'Week 4', streams: 130000, listeners: 65000 },
  { week: 'Week 5', streams: 170000, listeners: 85000 },
  { week: 'Week 6', streams: 200000, listeners: 100000 },
];

const trendingTracks = [
  {
    id: "t1",
    title: "Ascension",
    artist: "Aurora Borealis",
    genre: "Electronic",
    artwork: "https://via.placeholder.com/150/FF6347/FFFFFF?text=TrackA",
  },
  {
    id: "t2",
    title: "Lost in the City",
    artist: "Urban Echoes",
    genre: "Hip Hop",
    artwork: "https://via.placeholder.com/150/4682B4/FFFFFF?text=TrackB",
  },
  {
    id: "t3",
    title: "Whispering Pines",
    artist: "Forest Folk",
    genre: "Acoustic",
    artwork: "https://via.placeholder.com/150/32CD32/FFFFFF?text=TrackC",
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
            <h2 className="text-lg font-semibold text-foreground">Music Trends</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Trend Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Top Trending Track"
                  value="Ascension"
                  change="Electronic - Aurora Borealis"
                  icon={Music}
                  trend="up"
                />
                <StatsCard
                  title="Fastest Rising Artist"
                  value="Nova Beats"
                  change="+200K listeners last week"
                  icon={Users}
                  trend="up"
                />
                <StatsCard
                  title="Trending Genre"
                  value="Hyperpop"
                  change="+15% popularity this month"
                  icon={TrendingUp}
                  trend="up"
                />
                <StatsCard
                  title="Breakout Award"
                  value="New Talent Spotlight"
                  change="Awarded to Starlight Sounds"
                  icon={Award}
                  trend="up"
                />
              </div>

              {/* Trend Charts */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Weekly Performance Trend</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Streams and listener growth over the last 6 weeks.
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
                        name="Streams"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="listeners" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                        name="Listeners"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trending Tracks/Artists Section */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Currently Trending</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Explore the hottest tracks right now.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="grid gap-4">
                      {trendingTracks.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={track.artwork} alt={track.title} />
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
