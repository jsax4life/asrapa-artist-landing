import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Share2, BarChart3, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const notifyComingSoon = (feature: string) => {
    toast({
      title: t('dashboardHome.quickActions.comingSoonTitle'),
      description: t('dashboardHome.quickActions.comingSoonDescription', { feature }),
    });
  };

  const actions = [
    {
      title: t('dashboardHome.quickActions.uploadTrack.title'),
      description: t('dashboardHome.quickActions.uploadTrack.description'),
      icon: Upload,
      variant: "default" as const,
      color: "bg-primary",
      onClick: () => navigate(ROUTES.UPLOAD),
    },
    {
      title: t('dashboardHome.quickActions.viewLibrary.title'),
      description: t('dashboardHome.quickActions.viewLibrary.description'),
      icon: Music,
      variant: "secondary" as const,
      color: "bg-secondary",
      onClick: () => navigate(ROUTES.MUSIC_LIBRARY),
    },
    {
      title: t('dashboardHome.quickActions.shareContent.title'),
      description: t('dashboardHome.quickActions.shareContent.description'),
      icon: Share2,
      variant: "outline" as const,
      color: "bg-accent",
      onClick: () => notifyComingSoon(t('dashboardHome.quickActions.shareContent.featureName')),
    },
    {
      title: t('dashboardHome.quickActions.viewStats.title'),
      description: t('dashboardHome.quickActions.viewStats.description'),
      icon: BarChart3,
      variant: "ghost" as const,
      color: "bg-muted",
      onClick: () => navigate(ROUTES.ANALYTICS),
    },
  ];

  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{t('dashboardHome.quickActions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              onClick={action.onClick}
              className="h-auto p-3 flex items-center justify-start space-x-3 hover:scale-105 transition-all duration-200 hover:shadow-glow w-full"
            >
              <div className={`p-2 rounded-lg ${action.color} flex-shrink-0`}>
                <action.icon className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{action.title}</div>
                <div className="text-xs opacity-70 truncate">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}