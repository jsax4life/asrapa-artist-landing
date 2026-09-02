import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Share2, BarChart3, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/constants/routes";

export function QuickActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const notifyComingSoon = (feature: string) => {
    toast({
      title: "Fonctionnalité bientôt disponible",
      description: `${feature} sera disponible dans une prochaine mise à jour.`,
    });
  };

  const actions = [
    {
      title: "Téléverser un titre",
      description: "Ajouter un nouveau morceau à votre bibliothèque",
      icon: Upload,
      variant: "default" as const,
      color: "bg-primary",
      onClick: () => navigate(ROUTES.UPLOAD),
    },
    {
      title: "Voir ma bibliothèque",
      description: "Gérer vos singles et albums",
      icon: Music,
      variant: "secondary" as const,
      color: "bg-secondary",
      onClick: () => navigate(ROUTES.MUSIC_LIBRARY),
    },
    {
      title: "Partager du contenu",
      description: "Promouvoir sur les réseaux sociaux",
      icon: Share2,
      variant: "outline" as const,
      color: "bg-accent",
      onClick: () => notifyComingSoon("Le partage de contenu"),
    },
    {
      title: "Voir les statistiques",
      description: "Analyse détaillée des performances",
      icon: BarChart3,
      variant: "ghost" as const,
      color: "bg-muted",
      onClick: () => navigate(ROUTES.ANALYTICS),
    },
  ];

  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Actions rapides</CardTitle>
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