import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Music, Edit, Trash2, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const musicData = [
  {
    id: "1",
    title: "Sunset Serenade",
    artist: "Artist Name",
    album: "Echoes of Dawn",
    status: "Published",
    artwork: "https://via.placeholder.com/150/FFC0CB/000000?text=Track1",
  },
  {
    id: "2",
    title: "Midnight Dreams",
    artist: "Artist Name",
    album: "Echoes of Dawn",
    status: "Draft",
    artwork: "https://via.placeholder.com/150/ADD8E6/000000?text=Track2",
  },
  {
    id: "3",
    title: "City Lights",
    artist: "Artist Name",
    album: "Urban Symphony",
    status: "Under Review",
    artwork: "https://via.placeholder.com/150/90EE90/000000?text=Track3",
  },
  {
    id: "4",
    title: "Forest Whispers",
    artist: "Artist Name",
    album: "Nature's Call",
    status: "Published",
    artwork: "https://via.placeholder.com/150/FFD700/000000?text=Track4",
  },
  {
    id: "5",
    title: "Ocean Breeze",
    artist: "Artist Name",
    album: "Seaside Tales",
    status: "Published",
    artwork: "https://via.placeholder.com/150/87CEEB/000000?text=Track5",
  },
  {
    id: "6",
    title: "Mountain Echoes",
    artist: "Artist Name",
    album: "Echoes of Dawn",
    status: "Draft",
    artwork: "https://via.placeholder.com/150/DDA0DD/000000?text=Track6",
  },
];

const MusicLibrary = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Music Library</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Upload Music CTA */}
              <Card className="bg-card border-border shadow-card animate-fade-in flex flex-col sm:flex-row items-center justify-between p-6">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Ready to share new music?</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Upload your latest tracks and albums to reach your fans.
                  </CardDescription>
                </div>
                <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Music
                </Button>
              </Card>

              {/* Music List/Grid */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Your Releases</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your tracks and albums.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="grid gap-4">
                      {musicData.map((music) => (
                        <div key={music.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={music.artwork} alt={music.title} />
                            <AvatarFallback>{music.title.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{music.title}</p>
                            <p className="text-sm text-muted-foreground">{music.artist} - {music.album}</p>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                                music.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                                music.status === 'Draft' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {music.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-blue-500">
                              <BarChart2 className="h-4 w-4" />
                            </Button>
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

export default MusicLibrary;
