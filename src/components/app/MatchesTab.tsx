import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, Lock, Star, Youtube, Dices, Trophy, ChevronRight, Search } from "lucide-react";
import { GROUP_MATCHES, getFlagUrl, type Match } from "@/data/matches";

const FlagImg = ({ code, size = 40, className = "" }: { code: string; size?: number; className?: string }) => (
  <img
    src={getFlagUrl(code, size)}
    alt=""
    className={`rounded-sm object-cover shadow-sm ${className}`}
    style={{ width: size * 0.6, height: size * 0.6 * 0.7 }}
    loading="lazy"
  />
);

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
const ROUNDS = [1, 2, 3];

const MatchesTab = () => {
  const [matches, setMatches] = useState<Match[]>(GROUP_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [isGolden, setIsGolden] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedRound, setSelectedRound] = useState<number>(1);

  const filteredMatches = matches.filter((m) => {
    const groupOk = selectedGroup === "all" || m.group === selectedGroup;
    const roundOk = m.round === selectedRound;
    return groupOk && roundOk;
  });

  const openBet = (match: Match) => {
    setSelectedMatch(match);
    setHomeScore(match.bet?.home?.toString() ?? "");
    setAwayScore(match.bet?.away?.toString() ?? "");
    setIsGolden(match.golden ?? false);
  };

  const saveBet = () => {
    if (!selectedMatch) return;
    // BUG: bets are stored only in React state and are lost on page refresh.
    // TODO: persist to a `bets` table with columns:
    //   (pool_id, user_id, match_id, home_score, away_score, is_golden, pool_member_id)
    // Call: supabase.from("bets").upsert({ pool_id, user_id, match_id: selectedMatch.id,
    //   home_score: parseInt(homeScore)||0, away_score: parseInt(awayScore)||0, is_golden: isGolden },
    //   { onConflict: "pool_id,user_id,match_id" })
    // Until the table exists, bets are intentionally ephemeral.
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

  const betsPlaced = matches.filter((m) => m.bet).length;
  const totalMatches = matches.filter((m) => m.round === selectedRound).length;

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Copa do Mundo 2026</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">
            Fase de Grupos
          </h2>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Faça seus palpites para os jogos da Copa do Mundo 2026 nos EUA, Canadá e México.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20">
              <Star className="h-3.5 w-3.5 text-gold fill-gold" />
              <span className="text-xs font-semibold text-gold">{betsPlaced}/{totalMatches} palpites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Round Selector */}
      <div className="flex items-center gap-2 px-4 mt-4">
        {ROUNDS.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRound(r)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              selectedRound === r
                ? "text-foreground border-gold/40"
                : "text-muted-foreground border-transparent hover:border-gold/15"
            }`}
            style={selectedRound === r ? {
              background: 'linear-gradient(135deg, hsla(40,40%,55%,0.15), hsla(40,40%,55%,0.05))',
              boxShadow: '0 0 12px 2px hsla(40,40%,55%,0.12)'
            } : { background: 'hsla(216,55%,32%,0.5)' }}
          >
            Rodada {r}
          </button>
        ))}
      </div>

      {/* Group Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 px-4 mt-3 scrollbar-hide">
        <button
          onClick={() => setSelectedGroup("all")}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            selectedGroup === "all"
              ? "bg-gold/15 text-gold border-gold/30"
              : "bg-secondary/50 text-muted-foreground border-transparent hover:border-gold/10"
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
                ? "bg-gold/15 text-gold border-gold/30"
                : "bg-secondary/50 text-muted-foreground border-transparent hover:border-gold/10"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Match count header */}
      <div className="flex items-center justify-between px-4 mt-2 mb-2">
        <h3 className="font-display text-sm font-bold text-foreground">
          {selectedGroup === "all" ? "Todos os Jogos" : `Grupo ${selectedGroup}`}
        </h3>
        <Badge variant="outline" className="text-gold border-gold/20 text-[10px] bg-gold/5 px-2">
          {filteredMatches.length} jogos
        </Badge>
      </div>

      {filteredMatches.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm px-4">
          Nenhum jogo encontrado para este filtro.
        </div>
      )}

      {/* Match Cards */}
      <div className="space-y-2.5 px-4">
        {filteredMatches.map((match) => (
          <Drawer key={match.id}>
            <DrawerTrigger asChild>
              <button
                onClick={() => !match.locked && openBet(match)}
                disabled={match.locked}
                className={`w-full rounded-xl p-3.5 border transition-all duration-200 active:scale-[0.98] text-left group ${
                  match.locked ? "opacity-60" : "hover:border-gold/30"
                } ${match.golden ? "ring-1 ring-gold/30 shadow-gold-glow border-gold/25" : "border-gold/10"}`}
                style={{ background: 'hsl(216 60% 25%)' }}
              >
                {/* Top row: group badge, date, status */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gold/10 text-gold/80 border border-gold/15">
                      Grupo {match.group}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{match.date} • {match.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {match.golden && <Star className="h-3.5 w-3.5 text-gold fill-gold" />}
                    {match.locked ? (
                      <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-gold/60" />
                    )}
                  </div>
                </div>

                {/* Teams row */}
                <div className="flex items-center">
                  {/* Home team */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <FlagImg code={match.homeFlag} size={40} />
                    <span className="font-semibold text-sm text-foreground truncate">{match.home}</span>
                  </div>

                  {/* Score / Bet CTA */}
                  {match.bet ? (
                    <div className="flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 mx-1 shrink-0 border border-gold/20" style={{ background: 'hsla(40,40%,55%,0.08)' }}>
                      <span className="font-display text-lg font-bold text-foreground">{match.bet.home}</span>
                      <span className="text-[10px] text-muted-foreground mx-0.5">×</span>
                      <span className="font-display text-lg font-bold text-foreground">{match.bet.away}</span>
                    </div>
                  ) : (
                    <div className="mx-1 px-3 py-1.5 rounded-lg text-[11px] text-gold font-semibold border border-gold/25 shrink-0 group-hover:bg-gold/15 transition-colors" style={{ background: 'hsla(40,40%,55%,0.1)' }}>
                      Apostar
                    </div>
                  )}

                  {/* Away team */}
                  <div className="flex items-center gap-2.5 flex-1 justify-end min-w-0">
                    <span className="font-semibold text-sm text-foreground truncate">{match.away}</span>
                    <FlagImg code={match.awayFlag} size={40} />
                  </div>
                </div>

                {/* Locked CTA */}
                {match.locked && (
                  <a
                    href="https://youtube.com/@CaseTv"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[11px] text-destructive/70 hover:text-destructive mt-2 transition-colors"
                  >
                    <Youtube className="h-3 w-3" /> Assistir na CazéTV
                  </a>
                )}
              </button>
            </DrawerTrigger>

            {!match.locked && (
              <DrawerContent className="border-t border-gold/20" style={{ background: 'hsl(216 60% 25%)' }}>
                <DrawerHeader className="text-center">
                  <DrawerTitle className="font-display text-lg text-foreground flex items-center justify-center gap-2">
                    <FlagImg code={match.homeFlag} size={32} /> {match.home} vs {match.away} <FlagImg code={match.awayFlag} size={32} />
                  </DrawerTitle>
                  <p className="text-xs text-muted-foreground">Grupo {match.group} • {match.date} às {match.time}</p>
                </DrawerHeader>
                <div className="px-6 pb-2 space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center space-y-2">
                      <FlagImg code={match.homeFlag} size={56} />
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
                      <FlagImg code={match.awayFlag} size={56} />
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
    </div>
  );
};

export default MatchesTab;
