import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Plus, Share2, BarChart3 } from "lucide-react";

const actions = [
  {
    title: "Téléverser un titre",
    description: "Ajouter un nouveau morceau à votre bibliothèque",
    icon: Upload,
    variant: "default" as const,
    color: "bg-gradient-primary"
  },
  {
    title: "Créer une playlist",
    description: "Organiser vos sorties",
    icon: Plus,
    variant: "secondary" as const,
    color: "bg-gradient-secondary"
  },
  {
    title: "Partager du contenu",
    description: "Promouvoir sur les réseaux sociaux",
    icon: Share2,
    variant: "outline" as const,
    color: "bg-gradient-accent"
  },
  {
    title: "Voir les statistiques",
    description: "Analyse détaillée des performances",
    icon: BarChart3,
    variant: "ghost" as const,
    color: "bg-muted"
  }
];

export function QuickActions() {
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