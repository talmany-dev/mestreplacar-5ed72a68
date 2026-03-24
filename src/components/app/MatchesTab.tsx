import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, Lock, Star, Youtube, Dices } from "lucide-react";
import { GROUP_MATCHES, type Match } from "@/data/matches";

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

const MatchesTab = () => {
  const [matches, setMatches] = useState<Match[]>(GROUP_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isGolden, setIsGolden] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  const filteredMatches = selectedGroup === "all"
    ? matches
    : matches.filter((m) => m.group === selectedGroup);

  const openBet = (match: Match) => {
    setSelectedMatch(match);
    setHomeScore(match.bet?.home?.toString() ?? "");
    setAwayScore(match.bet?.away?.toString() ?? "");
    setIsGolden(match.golden ?? false);
  };

  const saveBet = () => {
    if (!selectedMatch) return;
    setMatches((prev) =>
      prev.map((m) =>
        m.id === selectedMatch.id
          ? { ...m, bet: { home: parseInt(homeScore) || 0, away: parseInt(awayScore) || 0 }, golden: isGolden }
          : isGolden ? { ...m, golden: false } : m
      )
    );
    setSelectedMatch(null);
  };

  const instantBet = () => {
    setHomeScore(String(Math.floor(Math.random() * 4)));
    setAwayScore(String(Math.floor(Math.random() * 3)));
  };

  const goldenUsed = matches.some((m) => m.golden && m.id !== selectedMatch?.id);

  return (
    <div className="p-4 space-y-3 pb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display text-xl font-bold text-foreground">Fase de Grupos</h2>
        <Badge variant="outline" className="text-gold border-gold/20 text-xs bg-gold/5">
          {filteredMatches.length} jogos
        </Badge>
      </div>

      {/* Group filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedGroup("all")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            selectedGroup === "all"
              ? "bg-gold/20 text-gold border-gold/30"
              : "bg-secondary text-muted-foreground border-transparent hover:border-gold/10"
          }`}
        >
          Todos
        </button>
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedGroup === g
                ? "bg-gold/20 text-gold border-gold/30"
                : "bg-secondary text-muted-foreground border-transparent hover:border-gold/10"
            }`}
          >
            Grupo {g}
          </button>
        ))}
      </div>

      {filteredMatches.map((match) => (
        <Drawer key={match.id}>
          <DrawerTrigger asChild>
            <button
              onClick={() => !match.locked && openBet(match)}
              disabled={match.locked}
              className={`w-full bg-card rounded-xl p-4 border border-gold/10 hover:border-gold/25 transition-all duration-200 active:scale-[0.98] text-left ${match.locked ? "opacity-70" : ""} ${match.golden ? "ring-1 ring-gold/30 shadow-gold-glow" : ""}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gold/15 text-gold/70">
                    {match.group}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{match.date} • {match.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {match.golden && <Star className="h-3.5 w-3.5 text-gold fill-gold" />}
                  {match.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : <Clock className="h-3.5 w-3.5 text-gold" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-2xl">{match.homeFlag}</span>
                  <span className="font-semibold text-sm text-foreground truncate">{match.home}</span>
                </div>
                {match.bet ? (
                  <div className="flex items-center gap-1 bg-secondary rounded-lg px-3 py-1.5 mx-2 border border-gold/10 shrink-0">
                    <span className="font-display text-lg font-bold text-foreground">{match.bet.home}</span>
                    <span className="text-xs text-muted-foreground mx-1">×</span>
                    <span className="font-display text-lg font-bold text-foreground">{match.bet.away}</span>
                  </div>
                ) : (
                  <div className="mx-2 px-3 py-1.5 rounded-lg bg-gold/10 text-xs text-gold font-medium border border-gold/20 shrink-0">
                    Apostar
                  </div>
                )}
                <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                  <span className="font-semibold text-sm text-foreground truncate">{match.away}</span>
                  <span className="text-2xl">{match.awayFlag}</span>
                </div>
              </div>
              {match.locked && (
                <a
                  href="https://youtube.com/@CaseTv"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive mt-2 transition-colors"
                >
                  <Youtube className="h-3 w-3" /> Assistir na CazéTV
                </a>
              )}
            </button>
          </DrawerTrigger>

          {!match.locked && (
            <DrawerContent className="bg-card border-t border-gold/20">
              <DrawerHeader className="text-center">
                <DrawerTitle className="font-display text-lg text-foreground">
                  {match.homeFlag} {match.home} vs {match.away} {match.awayFlag}
                </DrawerTitle>
                <p className="text-xs text-muted-foreground">Grupo {match.group} • {match.date} às {match.time}</p>
              </DrawerHeader>
              <div className="px-6 pb-2 space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center space-y-2">
                    <span className="text-3xl">{match.homeFlag}</span>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="w-20 h-14 text-center text-2xl font-display font-bold border border-gold/20 bg-secondary text-foreground focus:border-gold/50"
                    />
                  </div>
                  <span className="text-2xl text-muted-foreground font-display mt-8">×</span>
                  <div className="text-center space-y-2">
                    <span className="text-3xl">{match.awayFlag}</span>
                    <Input
                      type="number"
                      min="0"
                      max="20"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="w-20 h-14 text-center text-2xl font-display font-bold border border-gold/20 bg-secondary text-foreground focus:border-gold/50"
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full border-gold/20 text-gold hover:bg-gold/5" onClick={instantBet}>
                  <Dices className="mr-2 h-4 w-4" /> Aposta Instantânea
                </Button>

                <div className="flex items-center justify-between bg-gold/5 rounded-lg px-4 py-3 border border-gold/15">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-gold fill-gold" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Jogo Dourado</p>
                      <p className="text-xs text-muted-foreground">Dobra os pontos</p>
                    </div>
                  </div>
                  <Switch
                    checked={isGolden}
                    onCheckedChange={setIsGolden}
                    disabled={goldenUsed && !isGolden}
                  />
                </div>
                {goldenUsed && !isGolden && (
                  <p className="text-xs text-muted-foreground text-center -mt-4">Já usado em outro jogo desta rodada</p>
                )}
              </div>
              <DrawerFooter>
                <Button variant="hero" size="lg" className="shadow-gold-glow" onClick={saveBet}>
                  Confirmar Palpite
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost" className="text-muted-foreground">Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          )}
        </Drawer>
      ))}
    </div>
  );
};

export default MatchesTab;
