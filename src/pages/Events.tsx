import React from 'react';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Edit, Eye, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Live' | 'Past' | 'Cancelled';
  artwork: string;
}

const eventsData: EventData[] = [
  {
    id: "event1",
    name: "Summer Music Festival",
    date: "2024-08-10",
    time: "18:00",
    location: "Central Park, NYC",
    status: "Upcoming",
    artwork: "https://via.placeholder.com/150/FF6347/FFFFFF?text=Festival",
  },
  {
    id: "event2",
    name: "Virtual Album Launch",
    date: "2024-07-20",
    time: "15:00 UTC",
    location: "Online",
    status: "Upcoming",
    artwork: "https://via.placeholder.com/150/4682B4/FFFFFF?text=Launch",
  },
  {
    id: "event3",
    name: "Spring Concert Series",
    date: "2024-04-22",
    time: "19:30",
    location: "Local Venue",
    status: "Past",
    artwork: "https://via.placeholder.com/150/32CD32/FFFFFF?text=Concert",
  },
  {
    id: "event4",
    name: "Charity Gig",
    date: "2023-11-05",
    time: "20:00",
    location: "Community Hall",
    status: "Past",
    artwork: "https://via.placeholder.com/150/FFD700/000000?text=Charity",
  },
];

const Events = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">Your Events</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Create New Event CTA */}
              <Card className="bg-card border-border shadow-card animate-fade-in flex flex-col sm:flex-row items-center justify-between p-6">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">Organizing a new event?</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Schedule and promote your upcoming concerts, tours, or online events.
                  </CardDescription>
                </div>
                <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Create New Event
                </Button>
              </Card>

              {/* Events List */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">All Events</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Overview of your scheduled and past events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="grid gap-4">
                      {eventsData.map((event) => (
                        <div key={event.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarImage src={event.artwork} alt={event.name} />
                            <AvatarFallback>{event.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{event.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" /> {event.date} at {event.time}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </p>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                                event.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                                event.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                                event.status === 'Past' ? 'bg-gray-500/20 text-gray-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-green-500">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {event.status !== 'Past' && (
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
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

export default Events;
