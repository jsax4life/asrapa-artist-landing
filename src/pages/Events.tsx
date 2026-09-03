import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Edit, Eye, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EventData {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Live' | 'Past' | 'Cancelled';
}

const eventsData: EventData[] = [
  {
    id: "event1",
    name: "Festival de musique tchadienne",
    date: "2026-08-10",
    time: "18h00",
    location: "N'Djaména, Tchad",
    status: "Upcoming",
  },
  {
    id: "event2",
    name: "Lancement d'album en ligne",
    date: "2026-07-20",
    time: "15h00",
    location: "En ligne",
    status: "Upcoming",
  },
  {
    id: "event3",
    name: "Série de concerts de printemps",
    date: "2026-04-22",
    time: "19h30",
    location: "Moundou, Tchad",
    status: "Past",
  },
  {
    id: "event4",
    name: "Concert caritatif",
    date: "2025-11-05",
    time: "20h00",
    location: "Sarh, Tchad",
    status: "Past",
  },
];

const Events = () => {
  const { t } = useTranslation();

  const statusLabels: Record<EventData['status'], string> = {
    Upcoming: t('eventsPage.status.upcoming'),
    Live: t('eventsPage.status.live'),
    Past: t('eventsPage.status.past'),
    Cancelled: t('eventsPage.status.cancelled'),
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('eventsPage.header.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Create New Event CTA */}
              <Card className="bg-card border-border shadow-card animate-fade-in flex flex-col sm:flex-row items-center justify-between p-6">
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">{t('eventsPage.cta.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    {t('eventsPage.cta.description')}
                  </CardDescription>
                </div>
                <Button className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-primary-foreground flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {t('eventsPage.cta.button')}
                </Button>
              </Card>

              {/* Events List */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('eventsPage.list.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('eventsPage.list.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="grid gap-4">
                      {eventsData.map((event) => (
                        <div key={event.id} className="flex items-center space-x-4 p-3 hover:bg-accent/50 rounded-md transition-colors">
                          <Avatar className="h-16 w-16 rounded-md">
                            <AvatarFallback>{event.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{event.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" /> {t('eventsPage.dateTime', { date: event.date, time: event.time })}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.location}
                            </p>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 inline-block ${
                                event.status === 'Upcoming' ? 'bg-primary/20 text-primary' :
                                event.status === 'Live' ? 'bg-primary text-primary-foreground' :
                                event.status === 'Past' ? 'bg-white/10 text-white/50' :
                                'bg-white/10 text-white/40'
                            }`}>
                              {statusLabels[event.status]}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {event.status !== 'Past' && (
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
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
