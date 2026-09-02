import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, MoreHorizontal } from "lucide-react";

const releases = [
  {
    id: 1,
    title: "Dounia",
    type: "Single",
    streams: "1.2M",
    date: "2026-07-15",
    image: "🎵"
  },
  {
    id: 2,
    title: "N'Djamena la nuit",
    type: "Single",
    streams: "890K",
    date: "2026-06-20",
    image: "🎶"
  },
  {
    id: 3,
    title: "Terre du Tchad",
    type: "EP",
    streams: "2.1M",
    date: "2026-05-10",
    image: "🎼"
  },
  {
    id: 4,
    title: "Racines",
    type: "Single",
    streams: "654K",
    date: "2026-04-25",
    image: "🎹"
  }
];

export function RecentReleases() {
  return (
    <Card className="bg-card border-border shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Sorties récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {releases.map((release) => (
            <div key={release.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center text-xl">
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
      </CardContent>
    </Card>
  );
}