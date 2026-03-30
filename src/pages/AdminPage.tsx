import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Check, Users, Trophy, Settings2, Gift, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PoolMember {
  user_id: string;
  role: string;
  profile?: { full_name: string | null };
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { poolId } = useParams<{ poolId: string }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pool, setPool] = useState<any>(null);
  const [name, setName] = useState("");
  const [prizeInfo, setPrizeInfo] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(50);
  const [scoring, setScoring] = useState({
    exact_score: 25,
    winner_goal_diff: 18,
    winner_draw: 10,
    team_goals: 5,
    champion: 50,
  });
  const [members, setMembers] = useState<PoolMember[]>([]);

  useEffect(() => {
    if (poolId) fetchPool();
  }, [poolId]);

  const fetchPool = async () => {
    if (!poolId) return;

    const { data } = await supabase.from("pools").select("*").eq("id", poolId).single();
    if (!data) {
      navigate("/app");
      return;
    }

    setPool(data);
    setName(data.name);
    setPrizeInfo(data.prize_info || "");
    setMaxPlayers(data.max_players);
    const config = data.scoring_config as Record<string, number>;
    setScoring({
      exact_score: config.exact_score ?? 25,
      winner_goal_diff: config.winner_goal_diff ?? 18,
      winner_draw: config.winner_draw ?? 10,
      team_goals: config.team_goals ?? 5,
      champion: config.champion ?? 50,
    });

    // Fetch members with profiles
    const { data: membersData } = await supabase
      .from("pool_members")
      .select("user_id, role")
      .eq("pool_id", poolId);

    if (membersData) {
      const withProfiles = await Promise.all(
        membersData.map(async (m) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", m.user_id)
            .single();
          return { ...m, profile };
        })
      );
      setMembers(withProfiles);
    }

    setLoading(false);
  };

  const copyLink = () => {
    if (!pool) return;
    navigator.clipboard.writeText(pool.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!poolId) return;
    setSaving(true);

    const { error } = await supabase
      .from("pools")
      .update({
        name,
        prize_info: prizeInfo || null,
        max_players: maxPlayers,
        scoring_config: scoring,
      })
      .eq("id", poolId);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Alterações salvas com sucesso! ✅" });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!poolId) return;
    if (!confirm("Tem certeza que deseja excluir este bolão permanentemente?")) return;

    const { error } = await supabase.from("pools").delete().eq("id", poolId);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bolão excluído" });
      navigate("/app");
    }
  };

  const removeMember = async (userId: string) => {
    if (!poolId) return;
    await supabase.from("pool_members").delete().eq("pool_id", poolId).eq("user_id", userId);
    toast({ title: "Membro removido" });
    fetchPool();
  };

  const scoringLabels: Record<string, string> = {
    exact_score: "Placar Exato",
    winner_goal_diff: "Vencedor + Saldo de Gols",
    winner_draw: "Vencedor / Empate",
    team_goals: "Gols de um Time",
    champion: "Previsão de Campeão",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <header className="px-4 py-3 flex items-center gap-3 border-b border-accent/10 glassmorphism">
        <button onClick={() => navigate("/app")} className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg text-gradient-gold">PAINEL ADMIN</h1>
      </header>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Pool Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Informações</h2>
          </div>
          <div className="rounded-xl p-4 space-y-3 bg-secondary border border-accent/10">
            <div>
              <Label className="text-xs text-muted-foreground">Nome do Bolão</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 text-foreground bg-primary border-accent/15" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Limite de Participantes</Label>
              <Input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))} className="mt-1 text-foreground bg-primary border-accent/15" />
            </div>
          </div>
        </section>

        {/* Scoring Rules */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Regras de Pontuação</h2>
          </div>
          <div className="rounded-xl overflow-hidden bg-secondary border border-accent/10">
            {Object.entries(scoring).map(([key, pts], i, arr) => (
              <div key={key} className="flex items-center justify-between px-4 py-3" style={i < arr.length - 1 ? { borderBottom: "1px solid hsl(216 50% 30%)" } : {}}>
                <span className="text-sm text-foreground">{scoringLabels[key]}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={pts}
                    onChange={(e) => setScoring({ ...scoring, [key]: Number(e.target.value) })}
                    className="w-16 h-8 text-center text-sm font-display font-bold text-foreground bg-primary border-accent/15"
                  />
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prize */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Premiação</h2>
          </div>
          <div className="rounded-xl p-4 bg-secondary border border-accent/10">
            <Input value={prizeInfo} onChange={(e) => setPrizeInfo(e.target.value)} placeholder="Ex: 1º: R$500 | 2º: R$200" className="text-foreground bg-primary border-accent/15" />
          </div>
        </section>

        {/* Invite Link */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Código de Convite</h2>
          </div>
          <div className="rounded-xl p-4 bg-secondary border border-accent/10">
            <div className="flex gap-2">
              <Input value={pool?.join_code || ""} readOnly className="text-foreground bg-primary border-accent/15 font-mono tracking-widest text-center text-lg" />
              <Button variant="gold" size="icon" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </section>

        {/* Members */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-accent" />
            <h2 className="font-display text-lg font-bold text-foreground">Membros ({members.length})</h2>
          </div>
          <div className="rounded-xl overflow-hidden bg-secondary border border-accent/10">
            {members.map((member, i) => (
              <div key={member.user_id} className="flex items-center justify-between px-4 py-3" style={i < members.length - 1 ? { borderBottom: "1px solid hsl(216 50% 30%)" } : {}}>
                <span className="text-sm text-foreground">{member.profile?.full_name || "Sem nome"}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-accent/20 text-accent bg-accent/5">
                    {member.role === "admin" ? "Admin" : "Jogador"}
                  </Badge>
                  {member.role !== "admin" && member.user_id !== user?.id && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeMember(member.user_id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-3 pb-6">
          <Button variant="hero" className="w-full shadow-gold-glow" size="lg" onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir Bolão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
