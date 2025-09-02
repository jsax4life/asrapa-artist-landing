import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BarChart3, 
  Music, 
  Users, 
  Upload, 
  Settings,
  PlayCircle,
  TrendingUp,
  Calendar,
  LogOut
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
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useToast } from "@/hooks/use-toast";

const mainItems = [
  { title: "Dashboard", url: ROUTES.DASHBOARD, icon: Home },
  { title: "Analytics", url: ROUTES.ANALYTICS, icon: BarChart3 },
  { title: "Music Library", url: ROUTES.MUSIC_LIBRARY, icon: Music },
  { title: "Audience", url: ROUTES.AUDIENCE, icon: Users },
];

const contentItems = [
  { title: "Upload", url: ROUTES.UPLOAD, icon: Upload },
  { title: "Releases", url: ROUTES.RELEASES, icon: PlayCircle },
  { title: "Trends", url: ROUTES.TRENDS, icon: TrendingUp },
  { title: "Events", url: ROUTES.EVENTS, icon: Calendar },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
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
        {/* Artist Profile Section */}
        <div className={`mb-6 ${collapsed ? "hidden" : "block"}`}>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-primary">
            <div className="w-10 h-10 rounded-full bg-primary-glow flex items-center justify-center">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">
                {user?.fullName || user?.stageName || 'Artist'}
              </h3>
              <p className="text-sm text-primary-foreground/80">
                {user?.stageName ? user.stageName : 'Music Artist'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                    >
                      <item.icon className={`h-4 w-4 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 font-medium mb-2">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-3" />
                  {!collapsed && <span>Log Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}