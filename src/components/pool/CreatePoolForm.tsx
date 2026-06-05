import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Settings2, Gift, Users, Trophy, Check } from "lucide-react";
import { POOL_TIERS, type PoolTier } from "@/lib/pool-tiers";
import { cn } from "@/lib/utils";

const generateJoinCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

interface CreatePoolFormProps {
  onCreated: () => void;
}

const CreatePoolForm = ({ onCreated }: CreatePoolFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [tier, setTier] = useState<PoolTier>("tier_50");
  const [prizeInfo, setPrizeInfo] = useState("");
  const [scoring, setScoring] = useState({
    exact_score: 25,
    winner_goal_diff: 18,
    winner_draw: 10,
    team_goals: 5,
    champion: 50,
  });

  const handleCreate = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast({ title: "Dê um nome ao seu bolão", variant: "destructive" });
      return;
    }

    setLoading(true);
    const joinCode = generateJoinCode();
    const tierConfig = POOL_TIERS.find((t) => t.id === tier)!;

    const { data: created, error } = await supabase
      .from("pools")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        prize_info: prizeInfo.trim() || null,
        max_players: tierConfig.maxPlayers,
        tier: tierConfig.id,
        entry_fee_cents: tierConfig.entryFeeCents,
        join_code: joinCode,
        scoring_config: scoring,
      })
      .select("id")
      .single();

    if (error || !created) {
      toast({ title: "Erro ao criar bolão", description: error?.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    await supabase.from("pool_members").insert({
      pool_id: created.id,
      user_id: user.id,
      role: "admin" as const,
    });

    toast({
      title: "Bolão criado! 🎉",
      description: `Compartilhe o link de convite com a galera.`,
    });

    onCreated();
  };

  const scoringLabels: Record<string, string> = {
    exact_score: "Placar Exato",
    winner_goal_diff: "Vencedor + Saldo de Gols",
    winner_draw: "Vencedor / Empate",
    team_goals: "Gols de um Time",
    champion: "Previsão de Campeão",
  };

  return (
    <div className="space-y-6">
      {/* Pool Info */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-bold text-foreground">Informações do Bolão</h2>
        </div>
        <div className="rounded-xl p-4 bg-secondary border border-accent/10">
          <Label className="text-xs text-muted-foreground">Nome do Bolão</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Bolão da Copa 2026"
            className="mt-1 text-foreground bg-primary border-accent/15"
          />
        </div>
      </section>

      {/* Tier selection */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-bold text-foreground">Tamanho da Sala</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          A taxa de entrada é congelada no momento da criação. Mesmo aumentando o limite depois, quem entrar continua pagando o mesmo valor.
        </p>
        <div className="space-y-2">
          {POOL_TIERS.map((t) => {
            const selected = tier === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t.id)}
                className={cn(
                  "w-full text-left rounded-xl p-4 border transition-all bg-secondary",
                  selected
                    ? "border-accent shadow-gold-glow"
                    : "border-accent/10 hover:border-accent/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Taxa de entrada: <span className="text-accent font-medium">{t.pricePerPerson}</span> por pessoa
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0",
                      selected ? "border-accent bg-accent" : "border-muted-foreground/30"
                    )}
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Scoring Config */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="h-4 w-4 text-accent" />
          <h2 className="font-display text-lg font-bold text-foreground">Regras de Pontuação</h2>
        </div>
        <div className="rounded-xl overflow-hidden bg-secondary border border-accent/10">
          {Object.entries(scoring).map(([key, pts], i, arr) => (
            <div
              key={key}
              className="flex items-center justify-between px-4 py-3"
              style={i < arr.length - 1 ? { borderBottom: "1px solid hsl(216 50% 30%)" } : {}}
            >
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
          <Label className="text-xs text-muted-foreground">Descrição dos Prêmios</Label>
          <Input
            value={prizeInfo}
            onChange={(e) => setPrizeInfo(e.target.value)}
            placeholder="Ex: 1º: R$500 | 2º: R$200 | 3º: R$100"
            className="mt-1 text-foreground bg-primary border-accent/15"
          />
        </div>
      </section>

      <Button
        variant="hero"
        className="w-full shadow-gold-glow"
        size="lg"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Bolão"}
      </Button>
    </div>
  );
};

export default CreatePoolForm;
