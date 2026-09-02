import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, MoreHorizontal } from "lucide-react";

interface Release {
  id: number;
  title: string;
  type: string;
  streams: string;
  date: string;
  image: string;
}

const releases: Release[] = [];

export function RecentReleases() {
  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Sorties récentes</CardTitle>
      </CardHeader>
      <CardContent>
        {releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Aucune sortie pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {releases.map((release) => (
              <div key={release.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-xl">
                    {release.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{release.title}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{release.type}</span>
                      <span>•</span>
                      <span>{release.streams} écoutes</span>
                      <span>•</span>
                      <span>{new Date(release.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-glow">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}