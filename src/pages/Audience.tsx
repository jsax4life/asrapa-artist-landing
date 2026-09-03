import React from 'react';
import { useTranslation } from 'react-i18next';
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

const demoListenerActivityData = [
  { day: 1, listeners: 12000 },
  { day: 5, listeners: 15000 },
  { day: 10, listeners: 13000 },
  { day: 15, listeners: 18000 },
  { day: 20, listeners: 16000 },
  { day: 25, listeners: 20000 },
  { day: 30, listeners: 19000 },
];

const Audience = () => {
  const { t } = useTranslation();

  const demoGenderData = [
    { name: t('audiencePage.demographics.genderLabels.men'), value: 500, color: 'hsl(0 85% 60%)' },
    { name: t('audiencePage.demographics.genderLabels.women'), value: 300, color: 'hsl(0 0% 96%)' },
    { name: t('audiencePage.demographics.genderLabels.other'), value: 200, color: 'hsl(355 75% 42%)' },
  ];

  const geoCities = [
    { city: t('audiencePage.geography.cities.ndjamena'), percent: 45 },
    { city: t('audiencePage.geography.cities.moundou'), percent: 15 },
    { city: t('audiencePage.geography.cities.sarh'), percent: 10 },
    { city: t('audiencePage.geography.cities.diasporaFrance'), percent: 8 },
    { city: t('audiencePage.geography.cities.diasporaOther'), percent: 7 },
  ];

  const listenerSources = [
    { label: t('audiencePage.sources.items.direct'), percent: 30 },
    { label: t('audiencePage.sources.items.social'), percent: 25 },
    { label: t('audiencePage.sources.items.playlists'), percent: 20 },
    { label: t('audiencePage.sources.items.search'), percent: 15 },
    { label: t('audiencePage.sources.items.other'), percent: 10 },
  ];

  const chartActivityData = demoListenerActivityData.map((d) => ({
    day: t('audiencePage.activity.dayLabel', { count: d.day }),
    listeners: d.listeners,
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center border-b border-border bg-card px-6">
            <SidebarTrigger className="mr-4" />
            <h2 className="text-lg font-semibold text-foreground">{t('audiencePage.header.title')}</h2>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">

              {/* Audience Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title={t('audiencePage.stats.totalListeners')}
                  value="0"
                  icon={Users}
                  trend="neutral"
                />
                <StatsCard
                  title={t('audiencePage.stats.newListeners')}
                  value="0"
                  icon={UserPlus}
                  trend="neutral"
                />
                <StatsCard
                  title={t('audiencePage.stats.loyalListeners')}
                  value="0"
                  icon={UserCheck}
                  trend="neutral"
                />
                <StatsCard
                  title={t('audiencePage.stats.engagementRate')}
                  value="0 %"
                  icon={Heart}
                  trend="neutral"
                />
              </div>

              {/* Demographics & Geographic Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border shadow-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">{t('audiencePage.demographics.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('audiencePage.demographics.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('audiencePage.demographics.ageTitle')}</h3>
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
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('audiencePage.demographics.genderTitle')}</h3>
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
                    <CardTitle className="text-xl font-bold text-foreground">{t('audiencePage.geography.title')}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('audiencePage.geography.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {geoCities.map((c) => (
                        <li key={c.city}>{t('audiencePage.percentLabel', { label: c.city, percent: c.percent })}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Listener Activity Chart */}
              <Card className="bg-card border-border shadow-card animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{t('audiencePage.activity.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('audiencePage.activity.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartActivityData}>
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
                  <CardTitle className="text-xl font-bold text-foreground">{t('audiencePage.sources.title')}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t('audiencePage.sources.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {listenerSources.map((s) => (
                      <li key={s.label}>{t('audiencePage.percentLabel', { label: s.label, percent: s.percent })}</li>
                    ))}
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
