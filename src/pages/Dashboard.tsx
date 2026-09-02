import { StatsCard } from "@/components/dashboard-components/StatsCard";
import { PerformanceChart } from "@/components/dashboard-components/PerformanceChart";
import { RecentReleases } from "@/components/dashboard-components/RecentReleases";
import { QuickActions } from "@/components/dashboard-components/QuickActions";
import { Play, Users, TrendingUp, Music } from "lucide-react";
import artistProfile from "@/assets/images/artist-profile.jpg";
import { AppSidebar } from "@/components/dashboard-components/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/dashboard-sidebar";
import { useAuth } from "@/contexts/AuthContext";
 
const Dashboard = () => {
    const { user } = useAuth();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* <div className="min-h-screen p-3 sm:p-6 space-y-4  sm:space-y-6 bg-background"> */}


                <div className="flex-1 flex flex-col">
                    <header className="h-16 flex items-center border-b border-border bg-card px-6">
                        <SidebarTrigger className="mr-4" />
                        <h2 className="text-lg font-semibold text-foreground">Tableau de bord artiste</h2>
                    </header>


                    <main className="flex-1 overflow-auto">

                        <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6 bg-background">


          {/* Artist Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 sm:p-6 rounded-xl bg-gradient-hero shadow-glow animate-fade-in">
            <img 
              src={artistProfile} 
              alt="Photo de profil de l'artiste"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-primary-foreground/20 shadow-accent"
            />
            <div className="text-primary-foreground text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                Bon retour, {user?.fullName || user?.stageName || 'Artiste'}
              </h1>
              <p className="text-lg sm:text-xl opacity-90">
                {user?.stageName ? `${user.stageName} - ` : ''}Artiste musical
              </p>
              <p className="text-xs sm:text-sm opacity-70 mt-1">
                Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long'
                }) : 'récemment'}
              </p>
            </div>
          </div>

                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatsCard
                                    title="Écoutes totales"
                                    value="0"
                                    icon={Play}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title="Auditeurs mensuels"
                                    value="0"
                                    icon={Users}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title="Titres sortis"
                                    value="0"
                                    icon={Music}
                                    trend="neutral"
                                />
                                <StatsCard
                                    title="Taux de croissance"
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
