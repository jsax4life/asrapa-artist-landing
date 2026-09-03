import { useTranslation } from 'react-i18next';
import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { PerformanceChart } from "@/components/dashboard-components/PerformanceChart";
import { RecentReleases } from "@/components/dashboard-components/RecentReleases";
import { QuickActions } from "@/components/dashboard-components/QuickActions";
import { ProfilePhotoUploader } from "@/components/dashboard-components/ProfilePhotoUploader";
import { Play, Users, TrendingUp, Music } from "lucide-react";
import artistProfile from "@/assets/images/artist-profile.jpg";
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { useAuth } from "@/contexts/AuthContext";
 
const Dashboard = () => {
    const { user } = useAuth();
    const { t, i18n } = useTranslation();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* <div className="min-h-screen p-3 sm:p-6 space-y-4  sm:space-y-6 bg-background"> */}


                <div className="flex-1 flex flex-col">
                    <header className="h-16 flex items-center border-b border-border bg-card px-6">
                        <SidebarTrigger className="mr-4" />
                        <h2 className="text-lg font-semibold text-foreground">{t('dashboardHome.header.title')}</h2>
                    </header>


                    <main className="flex-1 overflow-auto">

                        <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">


          {/* Artist Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-primary shadow-glow animate-fade-in">
            <ProfilePhotoUploader fallbackSrc={artistProfile} />
            <div className="text-primary-foreground text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                {t('dashboardHome.welcome.title', { name: user?.fullName || user?.stageName || t('dashboardHome.welcome.defaultName') })}
              </h1>
              <p className="text-lg sm:text-xl opacity-90">
                {user?.stageName ? `${user.stageName} - ` : ''}{t('dashboardHome.welcome.subtitle')}
              </p>
              <p className="text-xs sm:text-sm opacity-70 mt-1">
                {t('dashboardHome.welcome.memberSince', {
                  date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString(i18n.language, {
                    year: 'numeric',
                    month: 'long'
                  }) : t('dashboardHome.welcome.recently')
                })}
              </p>
            </div>
          </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatsCard
                                    title={t('dashboardHome.stats.totalStreams')}
                                    value="0"
                                    icon={Play}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title={t('dashboardHome.stats.monthlyListeners')}
                                    value="0"
                                    icon={Users}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title={t('dashboardHome.stats.releasedTracks')}
                                    value="0"
                                    icon={Music}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title={t('dashboardHome.stats.growthRate')}
                                    value="0 %"
                                    icon={TrendingUp}
                                    trend="neutral"
                                />
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Performance Chart - Takes 2 columns */}
                                <div className="lg:col-span-2">
                                    <PerformanceChart />
                                </div>

                                {/* Quick Actions */}
                                <div>
                                    <QuickActions />
                                </div>
                            </div>

                            {/* Recent Releases */}
                            <RecentReleases />
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Dashboard;
