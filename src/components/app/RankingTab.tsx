import { useEffect, useState } from "react";
import { Crown, TrendingUp, Medal, Loader2, Trophy, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RankingTabProps {
  poolId: string;
}

interface RankEntry {
  userId: string;
  name: string;
  totalBets: number;
  pts: number;
  isYou: boolean;
}

const RankingTab = ({ poolId }: RankingTabProps) => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRealScores, setHasRealScores] = useState(false);

  const loadRanking = async () => {
    if (!poolId) return;
    setLoading(true);

    // Load all members of this pool
    const { data: members } = await supabase
      .from("pool_members")
      .select("user_id, id")
      .eq("pool_id", poolId);

    if (!members?.length) { setLoading(false); return; }

    const userIds = members.map((m) => m.user_id);

    // Load real scores from pool_scores table
    const { data: scores } = await supabase
      .from("pool_scores")
      .select("user_id, total_pts")
      .eq("pool_id", poolId);

    // Load bet counts per user
    const { data: bets } = await supabase
      .from("bets")
      .select("user_id")
      .eq("pool_id", poolId);

    // Load profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const realScoreMap = new Map((scores || []).map((s) => [s.user_id, s.total_pts]));
    const betCountMap = new Map<string, number>();
    for (const bet of bets || []) {
      betCountMap.set(bet.user_id, (betCountMap.get(bet.user_id) ?? 0) + 1);
    }

    const hasReal = realScoreMap.size > 0;
    setHasRealScores(hasReal);

    const entries: RankEntry[] = members.map((m) => {
      const profile = profiles?.find((p) => p.id === m.user_id);
      const betCount = betCountMap.get(m.user_id) ?? 0;
      const pts = hasReal
        ? (realScoreMap.get(m.user_id) ?? 0)
        : betCount * 5; // placeholder before any matches finish

      return {
        userId: m.user_id,
        name: profile?.full_name || "Participante",
        totalBets: betCount,
        pts,
        isYou: m.user_id === user?.id,
      };
    });

    entries.sort((a, b) => b.pts - a.pts || b.totalBets - a.totalBets);
    setRanking(entries);
    setLoading(false);
  };

  useEffect(() => {
    loadRanking();

    // Realtime: atualiza ranking quando pool_scores mudar
    const channel = supabase
      .channel(`ranking:${poolId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pool_scores", filter: `pool_id=eq.${poolId}` },
        () => { loadRanking(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [poolId, user]);

  const myEntry = ranking.find((r) => r.isYou);
  const myRank = myEntry ? ranking.indexOf(myEntry) + 1 : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      <div
        className="relative mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-2">
            <Medal className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Classificação</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground mb-0.5">Sua Posição</h2>
              <p className="text-xs text-muted-foreground">Ranking atualizado em tempo real</p>
            </div>
            <span className="font-display text-4xl font-bold text-gold">
              {myRank ? `#${myRank}º` : "-"}
            </span>
          </div>
          {myEntry && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20">
                <TrendingUp className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-semibold text-gold">{myEntry.totalBets} palpites</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20">
                <Crown className="h-3.5 w-3.5 text-gold" />
                <span className="text-xs font-semibold text-gold">{myEntry.pts} pts</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status info */}
      <div className="mx-4 mt-3 p-3 rounded-xl bg-secondary/50 border border-gold/10 flex items-center gap-2">
        <Zap className={`h-3.5 w-3.5 shrink-0 ${hasRealScores ? "text-green-400" : "text-amber-400"}`} />
        <p className="text-xs text-muted-foreground">
          {hasRealScores
            ? "✅ Pontuação calculada com base nos resultados reais dos jogos."
            : "⏳ Jogos ainda não começaram. Cada palpite registrado vale 5 pts provisórios."}
        </p>
      </div>

      {/* Ranking Header */}
      <div className="flex items-center justify-between px-4 mt-4 mb-2">
        <h3 className="font-display text-sm font-bold text-foreground">Ranking do Bolão</h3>
        <span className="text-xs text-muted-foreground">{ranking.length} participantes</span>
      </div>

      {ranking.length === 0 ? (
        <div className="text-center py-12 px-4">
          <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
        </div>
      ) : (
        <div className="space-y-2.5 px-4">
          {ranking.map((player, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={player.userId}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all duration-200 ${
                  player.isYou ? "border-gold/30 shadow-gold-glow" : "border-gold/10"
                }`}
                style={{ background: player.isYou ? "hsla(40,40%,55%,0.08)" : "hsl(216 60% 25%)" }}
              >
                <span
                  className={`font-display text-lg font-bold w-8 text-center ${
                    rank <= 3 || player.isYou ? "text-gold" : "text-muted-foreground"
                  }`}
                >
                  {String(rank).padStart(2, "0")}
                </span>
                {rank === 1 && <Crown className="h-5 w-5 text-gold fill-gold -ml-1" />}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      player.isYou ? "text-gold font-semibold" : "text-foreground"
                    }`}
                  >
                    {player.name} {player.isYou ? "(Você)" : ""}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{player.totalBets} palpites feitos</p>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-sm tabular-nums text-foreground">
                    {player.pts}
                  </span>
                  <p className="text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RankingTab;
