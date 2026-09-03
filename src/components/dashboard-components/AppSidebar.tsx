import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  BarChart3,
  Music,
  Users,
  Upload,
  TrendingUp,
  Calendar,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/dashboard-sidebar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";
import artistProfile from "@/assets/images/artist-profile.jpg";

export function AppSidebar() {
  const { t } = useTranslation();
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const mainItems = [
    { titleKey: "sidebar.dashboard", url: ROUTES.DASHBOARD, icon: Home },
    { titleKey: "sidebar.analytics", url: ROUTES.ANALYTICS, icon: BarChart3 },
    { titleKey: "sidebar.musicLibrary", url: ROUTES.MUSIC_LIBRARY, icon: Music },
    { titleKey: "sidebar.audience", url: ROUTES.AUDIENCE, icon: Users },
  ];

  const contentItems = [
    { titleKey: "sidebar.upload", url: ROUTES.UPLOAD, icon: Upload },
    { titleKey: "sidebar.trends", url: ROUTES.TRENDS, icon: TrendingUp },
    { titleKey: "sidebar.events", url: ROUTES.EVENTS, icon: Calendar },
  ];

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const handleLogout = () => {
    logout();
    toast({
      title: t('sidebar.logoutToastTitle'),
      description: t('sidebar.logoutToastDescription'),
    });
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <Sidebar
      className={`border-sidebar-border bg-sidebar transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        <div className={`mb-6 ${collapsed ? "hidden" : "block"}`}>
          <NavLink
            to={ROUTES.SETTINGS}
            className="flex items-center space-x-3 p-3 rounded-lg bg-primary hover:bg-primary/90 transition-colors"
          >
            <img
              src={user?.profilePhotoUrl || artistProfile}
              alt={t('sidebar.profilePhotoAlt')}
              className="w-10 h-10 rounded-full object-cover border border-primary-foreground/20"
            />
            <div>
              <h3 className="font-semibold text-primary-foreground">
                {user?.fullName || user?.stageName || 'Artist'}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {user?.stageName ? user.stageName : t('sidebar.musicArtist')}
              </p>
            </div>
          </NavLink>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            {t('sidebar.main')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            {t('sidebar.content')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            {t('sidebar.settings')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to={ROUTES.SETTINGS} className={getNavCls}>
                    <SettingsIcon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-3"}`} />
                    {!collapsed && <span>{t('sidebar.settings')}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {!collapsed && (
                <SidebarMenuItem>
                  <div className="px-3 py-2">
                    <LanguageSwitcher variant="compact" />
                  </div>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-3" />
                  {!collapsed && <span>{t('sidebar.logOut')}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
