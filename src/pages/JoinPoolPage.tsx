import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trophy, Users, Gift, Loader2, AlertTriangle } from "lucide-react";
import { getTier, formatFee } from "@/lib/pool-tiers";
import logo from "@/assets/logo.png";

interface PoolPreview {
  id: string;
  name: string;
  prize_info: string | null;
  max_players: number;
  tier: string;
  entry_fee_cents: number;
  join_code: string;
  owner_id: string;
}

const JoinPoolPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pool, setPool] = useState<PoolPreview | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [ownerName, setOwnerName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) return;
    (async () => {
      const { data } = await supabase
        .from("pools")
        .select("id, name, prize_info, max_players, tier, entry_fee_cents, join_code, owner_id")
        .eq("join_code", code.toUpperCase())
        .maybeSingle();

      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPool(data);

      const { count } = await supabase
        .from("pool_members")
        .select("*", { count: "exact", head: true })
        .eq("pool_id", data.id);
      setMemberCount(count ?? 0);

      const { data: owner } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.owner_id)
        .maybeSingle();
      setOwnerName(owner?.full_name || "um amigo");

      if (user) {
        const { data: m } = await supabase
          .from("pool_members")
          .select("id, payment_status")
          .eq("pool_id", data.id)
          .eq("user_id", user.id)
          .maybeSingle();
        setAlreadyMember(!!m);
        if (m && m.payment_status === "pending") {
          navigate(`/pay/${data.id}`, { replace: true });
          return;
        }
      }
      setLoading(false);
    })();
  }, [code, user]);

  const handleAccept = async () => {
    if (!pool) return;
    if (!user) {
      navigate(`/signup?redirect=${encodeURIComponent(`/join/${pool.join_code}`)}`);
      return;
    }
    if (alreadyMember) {
      navigate("/app");
      return;
    }
    if (memberCount >= pool.max_players) {
      toast({ title: "Sala lotada", description: "Peça ao organizador para aumentar o limite.", variant: "destructive" });
      return;
    }
    setJoining(true);
    const { error } = await supabase.from("pool_members").insert({
      pool_id: pool.id,
      user_id: user.id,
      role: "player" as const,
      payment_status: "pending",
    });
    setJoining(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Vaga reservada em ${pool.name}!`, description: "Finalize o Pix para liberar seus palpites." });
    navigate(`/pay/${pool.id}`);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (notFound || !pool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
        <AlertTriangle className="h-12 w-12 text-destructive mb-3" />
        <h1 className="font-display text-xl text-foreground mb-2">Convite inválido</h1>
        <p className="text-sm text-muted-foreground mb-6">Este link não corresponde a nenhum bolão ativo.</p>
        <Button variant="hero" onClick={() => navigate("/")}>Voltar ao início</Button>
      </div>
    );
  }

  const tier = getTier(pool.tier);
  const remaining = Math.max(0, pool.max_players - memberCount);
  const isFull = remaining === 0 && !alreadyMember;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Mestre do Placar" className="h-16 w-16 mx-auto mb-3 rounded-xl shadow-lg" />
          <p className="text-xs uppercase tracking-widest text-accent/80">Você foi convidado</p>
        </div>

        <div className="rounded-2xl p-6 bg-secondary border border-accent/15 shadow-gold-glow">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-accent" />
            <h1 className="font-display text-2xl font-bold text-foreground">{pool.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Organizado por <span className="text-foreground font-medium">{ownerName}</span>
          </p>

          {pool.prize_info && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-accent/5 border border-accent/15">
              <Gift className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{pool.prize_info}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-lg bg-primary/40 border border-accent/10">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Users className="h-3.5 w-3.5" />
                Vagas
              </div>
              <p className="font-display text-lg font-bold text-foreground">
                {isFull ? (
                  <span className="text-destructive">Esgotado</span>
                ) : (
                  <>Restam <span className="text-accent">{remaining}</span></>
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">{memberCount}/{pool.max_players}</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/40 border border-accent/10">
              <div className="text-xs text-muted-foreground mb-1">Taxa de entrada</div>
              <p className="font-display text-lg font-bold text-accent">{formatFee(pool.entry_fee_cents)}</p>
              <p className="text-[11px] text-muted-foreground">{tier.label}</p>
            </div>
          </div>

          {remaining <= 3 && remaining > 0 && (
            <p className="text-center text-xs text-accent mb-3 animate-pulse">
              ⚡ Restam apenas {remaining} {remaining === 1 ? "vaga" : "vagas"}!
            </p>
          )}

          <Button
            variant="hero"
            size="lg"
            className="w-full shadow-gold-glow"
            onClick={handleAccept}
            disabled={joining || isFull}
          >
            {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {alreadyMember
              ? "Você já participa — abrir bolão"
              : isFull
                ? "Sala lotada"
                : user
                  ? "Aceitar convite"
                  : "Aceitar convite e criar conta"}
          </Button>

          {!user && !isFull && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              Já tem conta?{" "}
              <button
                className="text-accent hover:underline"
                onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/join/${pool.join_code}`)}`)}
              >
                Entrar
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinPoolPage;
