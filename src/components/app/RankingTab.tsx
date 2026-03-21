import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, TrendingDown, Minus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  rank: number;
  name: string;
  pts: number;
  trend: "up" | "down" | "same";
  division: "A" | "B" | "C";
  isYou?: boolean;
}

const PLAYERS: Player[] = [
  { rank: 1, name: "Carlos M.", pts: 187, trend: "same", division: "A" },
  { rank: 2, name: "Ana Paula", pts: 172, trend: "up", division: "A" },
  { rank: 3, name: "Rodrigo S.", pts: 158, trend: "down", division: "A" },
  { rank: 4, name: "Você", pts: 127, trend: "up", division: "A", isYou: true },
  { rank: 5, name: "Fernanda L.", pts: 121, trend: "down", division: "A" },
  { rank: 6, name: "Pedro H.", pts: 115, trend: "same", division: "B" },
  { rank: 7, name: "Juliana R.", pts: 108, trend: "up", division: "B" },
  { rank: 8, name: "Marcos V.", pts: 94, trend: "down", division: "B" },
  { rank: 9, name: "Bianca T.", pts: 87, trend: "same", division: "C" },
  { rank: 10, name: "Lucas F.", pts: 72, trend: "down", division: "C" },
];

const divisionColors = {
  A: { bg: "bg-gold/10", text: "text-gold", border: "border-gold/20" },
  B: { bg: "bg-grass/10", text: "text-grass", border: "border-grass/20" },
  C: { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-grass" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const RankingTab = () => {
  const shareToStories = () => {
    alert("Compartilhamento visual gerado! (funcionalidade completa requer backend)");
  };

  return (
    <div className="p-4 space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Ranking Geral</h2>
        <Button variant="outline" size="sm" onClick={shareToStories} className="text-xs gap-1.5 border-gold/20 text-gold hover:bg-gold/5">
          <Share2 className="h-3.5 w-3.5" /> Stories
        </Button>
      </div>

      <div className="flex gap-2">
        {(["A", "B", "C"] as const).map((d) => (
          <Badge key={d} variant="outline" className={`${divisionColors[d].bg} ${divisionColors[d].text} ${divisionColors[d].border} text-xs`}>
            Série {d}
          </Badge>
        ))}
      </div>

      <div className="space-y-2">
        {PLAYERS.map((player, i) => {
          const dc = divisionColors[player.division];
          const isFirst = i === 0 || PLAYERS[i - 1].division !== player.division;

          return (
            <div key={player.rank}>
              {isFirst && (
                <p className={`text-xs font-semibold uppercase tracking-wider mt-3 mb-1.5 ${dc.text}`}>
                  Série {player.division}
                </p>
              )}
              <div className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 border ${player.isYou ? "bg-gold/5 border-gold/25" : "bg-card border-gold/10"}`}>
                <span className={`font-display text-lg font-bold w-7 text-center ${player.rank <= 3 ? "text-gold" : "text-muted-foreground"}`}>
                  {player.rank}
                </span>
                {player.rank === 1 && <Crown className="h-4 w-4 text-gold fill-gold -ml-1" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${player.isYou ? "text-gold font-semibold" : "text-foreground"}`}>
                    {player.name}
                  </p>
                </div>
                <TrendIcon trend={player.trend} />
                <span className="font-display font-bold text-sm tabular-nums text-foreground w-12 text-right">{player.pts} pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankingTab;
