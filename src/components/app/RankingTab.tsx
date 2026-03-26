import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Share2, Info, ChevronUp, ChevronDown, Minus, AlertTriangle, Medal } from "lucide-react";
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
    <div className="pb-4">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Classificação</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-0.5">
                Sua Posição
              </h2>
              <p className="text-xs text-muted-foreground">
                Acompanhe seu desempenho no ranking global
              </p>
            </div>
            <span className="font-display text-4xl font-bold text-gold">#{userPlayer?.rank}º</span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20">
              <TrendingUp className="h-3.5 w-3.5 text-grass" />
              <span className="text-xs font-semibold text-grass">Subiu 12 posições</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20">
              <Crown className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-semibold text-gold">{userPlayer?.pts?.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Division Filter */}
      <div className="flex items-center gap-2 px-4 mt-4">
        {(["A", "B", "C"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDivision(selectedDivision === d ? "all" : d)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              selectedDivision === d
                ? "text-foreground border-gold/40"
                : "text-muted-foreground border-transparent hover:border-gold/15"
            }`}
            style={selectedDivision === d ? {
              background: 'linear-gradient(135deg, hsla(40,40%,55%,0.15), hsla(40,40%,55%,0.05))',
              boxShadow: '0 0 12px 2px hsla(40,40%,55%,0.12)'
            } : { background: 'hsla(216,55%,32%,0.5)' }}
          >
            Série {d}
          </button>
        ))}
      </div>

      {/* Share button */}
      <div className="px-4 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={shareToStories}
          className="w-full text-xs gap-1.5 border-gold/20 text-gold hover:bg-gold/5"
        >
          <Share2 className="h-3.5 w-3.5" /> Compartilhar nos Stories
        </Button>
      </div>

      {/* Ranking Header */}
      <div className="flex items-center justify-between px-4 mt-4 mb-2">
        <div className="flex items-center gap-1.5">
          <h3 className="font-display text-sm font-bold text-foreground">Ranking Global</h3>
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

      {/* Player List */}
      <div className="space-y-2.5 px-4">
        {filteredPlayers.map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 border ${
              player.isYou
                ? "border-gold/30 shadow-gold-glow"
                : player.zone === "promotion"
                ? "border-l-2 border-l-grass border-gold/10"
                : player.zone === "relegation"
                ? "border-l-2 border-l-destructive border-gold/10"
                : "border-gold/10"
            }`}
            style={{ background: player.isYou ? 'hsla(40,40%,55%,0.08)' : 'hsl(216 60% 25%)' }}
          >
            <span
              className={`font-display text-lg font-bold w-8 text-center ${
                player.rank <= 3 ? "text-gold" : player.isYou ? "text-gold" : "text-muted-foreground"
              }`}
            >
              {String(player.rank).padStart(2, "0")}
            </span>

            {player.rank === 1 && <Crown className="h-5 w-5 text-gold fill-gold -ml-1" />}

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${player.isYou ? "text-gold font-semibold" : "text-foreground"}`}>
                {player.name}
              </p>
              {player.trendLabel && (
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendIcon trend={player.trend} />
                  <span className={`text-[11px] ${
                    player.trend === "up" ? "text-grass"
                      : player.trend === "down" || player.trend === "danger" ? "text-destructive"
                      : "text-muted-foreground"
                  }`}>
                    {player.trendLabel}
                  </span>
                </div>
              )}
            </div>

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
  );
};

export default RankingTab;
