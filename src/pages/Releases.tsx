import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Eye, Edit, Archive } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReleaseData {
  id: string;
  title: string;
  type: string; // e.g., Single, EP, Album
  releaseDate: string;
  status: 'Upcoming' | 'Active' | 'Distributed' | 'Archived';
  artwork: string;
}

const releasesData: ReleaseData[] = [
  {
    id: "rel1",
    title: "Eternal Echoes",
    type: "Album",
    releaseDate: "2023-10-26",
    status: "Active",
    artwork: "https://via.placeholder.com/150/FFC0CB/000000?text=Album1",
  },
  {
    id: "rel2",
    title: "Starlight Serenade",
    type: "Single",
    releaseDate: "2024-01-15",
    status: "Distributed",
    artwork: "https://via.placeholder.com/150/ADD8E6/000000?text=Single1",
  },
  {
    id: "rel3",
    title: "Dreamscape",
    type: "EP",
    releaseDate: "2024-03-01",
    status: "Upcoming",
    artwork: "https://via.placeholder.com/150/90EE90/000000?text=EP1",
  },
  {
    id: "rel4",
    title: "Crimson Tide",
    type: "Single",
    releaseDate: "2023-07-20",
    status: "Archived",
    artwork: "https://via.placeholder.com/150/FFD700/000000?text=Single2",
  },
  {
    id: "rel5",
    title: "Nebula Nights",
    type: "Album",
    releaseDate: "2024-05-10",
    status: "Upcoming",
    artwork: "https://via.placeholder.com/150/87CEEB/000000?text=Album2",
  },
];

const Releases = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Your Releases</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* New Release CTA */}
              <Card className="bg-card border-border shadow-card animate-fade-in flex flex-col sm:flex-row items-center justify-between p-6">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Plan your next big release?</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Create and schedule new singles, EPs, or albums.
                  </CardDescription>
                </div>
                <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Create New Release
                </Button>
              </Card>

              {/* Releases List */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">All Releases</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Overview of your music releases.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="grid gap-4">
                      {releasesData.map((release) => (
                        <div key={release.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={release.artwork} alt={release.title} />
                            <AvatarFallback>{release.title.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{release.title} <span className="text-sm text-muted-foreground">({release.type})</span></p>
                            <p className="text-sm text-muted-foreground">Release Date: {release.releaseDate}</p>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                                release.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                release.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                release.status === 'Distributed' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                              {release.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-green-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-gray-500">
                              <Archive className="h-4 w-4" />
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

export default Releases;
