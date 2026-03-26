import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, TrendingDown, Minus, Share2, Info, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Player {
  rank: number;
  name: string;
  pts: number;
  trend: "up" | "down" | "same" | "danger";
  trendLabel?: string;
  division: "A" | "B" | "C";
  isYou?: boolean;
  zone?: "promotion" | "relegation";
}

const PLAYERS: Player[] = [
  { rank: 1, name: "João Diniz", pts: 2450, trend: "up", trendLabel: "Gol-a-Gol", division: "A", zone: "promotion" },
  { rank: 2, name: "Marcos Rocha", pts: 2120, trend: "same", trendLabel: "Estável", division: "A", zone: "promotion" },
  { rank: 3, name: "Ana Paula", pts: 1980, trend: "up", trendLabel: "Subindo", division: "A" },
  { rank: 4, name: "Rodrigo S.", pts: 1850, trend: "down", trendLabel: "Caindo", division: "A" },
  { rank: 5, name: "Fernanda L.", pts: 1720, trend: "up", trendLabel: "Subindo", division: "A" },
  { rank: 42, name: "Você (Apostador Elite)", pts: 1280, trend: "up", trendLabel: "Subindo", division: "B", isYou: true },
  { rank: 43, name: "Lucas Andrade", pts: 1275, trend: "down", trendLabel: "Caindo", division: "B" },
  { rank: 44, name: "Pedro H.", pts: 1260, trend: "same", trendLabel: "Estável", division: "B" },
  { rank: 98, name: "Bianca T.", pts: 450, trend: "down", trendLabel: "Caindo", division: "C", zone: "relegation" },
  { rank: 99, name: "Sandro Melo", pts: 420, trend: "danger", trendLabel: "Rebaixamento", division: "C", zone: "relegation" },
];

type Division = "A" | "B" | "C";

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <ChevronUp className="h-4 w-4 text-grass" />;
  if (trend === "down") return <ChevronDown className="h-4 w-4 text-destructive" />;
  if (trend === "danger") return <AlertTriangle className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const RankingTab = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division | "all">("all");

  const shareToStories = () => {
    alert("Compartilhamento visual gerado! (funcionalidade completa requer backend)");
  };

  const filteredPlayers = selectedDivision === "all"
    ? PLAYERS
    : PLAYERS.filter((p) => p.division === selectedDivision);

  const userPlayer = PLAYERS.find((p) => p.isYou);

  return (
    <div className="p-4 space-y-4 pb-4">
      {/* Your Position Card */}
      <div className="rounded-2xl border border-gold/20 bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gold/10 flex items-center justify-center">
              <Crown className="h-4 w-4 text-gold" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Sua Posição</span>
          </div>
          <span className="font-display text-3xl font-bold text-foreground">#{userPlayer?.rank}º</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-grass">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Subiu 12 posições hoje</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Total de Pontos</p>
            <p className="font-display text-2xl font-bold text-gold">{userPlayer?.pts?.toLocaleString()}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={shareToStories}
            className="text-xs gap-1.5 border-gold/20 text-gold hover:bg-gold/5"
          >
            <Share2 className="h-3.5 w-3.5" /> Stories
          </Button>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex gap-2">
        {(["A", "B", "C"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDivision(selectedDivision === d ? "all" : d)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
              selectedDivision === d
                ? d === "A"
                  ? "bg-gold/20 text-gold border-gold/30"
                  : d === "B"
                  ? "bg-grass/20 text-grass border-grass/30"
                  : "bg-muted text-muted-foreground border-border"
                : "bg-card border-border text-muted-foreground hover:border-gold/20"
            }`}
          >
            Série {d}
          </button>
        ))}
      </div>

      {/* Ranking List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-lg font-bold text-foreground">Ranking Global</h3>
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-grass">
              <span className="h-2 w-2 rounded-full bg-grass" /> Promoção
            </span>
            <span className="flex items-center gap-1 text-destructive">
              <span className="h-2 w-2 rounded-full bg-destructive" /> Rebaixamento
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {filteredPlayers.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 border ${
                player.isYou
                  ? "bg-gold/10 border-gold/30 shadow-gold-glow"
                  : player.zone === "promotion"
                  ? "bg-card border-l-2 border-l-grass border-gold/10"
                  : player.zone === "relegation"
                  ? "bg-card border-l-2 border-l-destructive border-gold/10"
                  : "bg-card border-gold/10"
              }`}
            >
              {/* Rank */}
              <span
                className={`font-display text-lg font-bold w-8 text-center ${
                  player.rank <= 3 ? "text-gold" : player.isYou ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {String(player.rank).padStart(2, "0")}
              </span>

              {/* Crown for #1 */}
              {player.rank === 1 && <Crown className="h-5 w-5 text-gold fill-gold -ml-1" />}

              {/* Name + Trend Label */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    player.isYou ? "text-gold font-semibold" : "text-foreground"
                  }`}
                >
                  {player.name}
                </p>
                {player.trendLabel && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendIcon trend={player.trend} />
                    <span
                      className={`text-[11px] ${
                        player.trend === "up"
                          ? "text-grass"
                          : player.trend === "down" || player.trend === "danger"
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {player.trendLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Points */}
              <div className="text-right">
                <span className="font-display font-bold text-sm tabular-nums text-foreground">
                  {player.pts.toLocaleString()}
                </span>
                <p className="text-[10px] text-muted-foreground">Pontos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingTab;
