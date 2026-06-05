import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Trophy, Loader2, CheckCircle2, QrCode, ArrowLeft } from "lucide-react";
import { formatFee } from "@/lib/pool-tiers";
import logo from "@/assets/logo.png";

interface PoolInfo {
  id: string;
  name: string;
  entry_fee_cents: number;
}

const PaywallPage = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pool, setPool] = useState<PoolInfo | null>(null);
  const [status, setStatus] = useState<"pending" | "paid" | "exempt" | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!poolId) return;
    let cancelled = false;

    const load = async () => {
      const { data: p } = await supabase
        .from("pools")
        .select("id, name, entry_fee_cents")
        .eq("id", poolId)
        .maybeSingle();
      const { data: m } = await supabase
        .from("pool_members")
        .select("payment_status")
        .eq("pool_id", poolId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setPool(p);
      setStatus((m?.payment_status as any) ?? null);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`paywall-${poolId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "pool_members",
          filter: `pool_id=eq.${poolId}`,
        },
        (payload) => {
          const row = payload.new as { user_id: string; payment_status: string };
          if (row.user_id === user.id) {
            setStatus(row.payment_status as any);
            if (row.payment_status === "paid") {
              toast({ title: "Pagamento confirmado! ✅" });
            }
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [poolId, user, authLoading, navigate, toast]);

  // If returning from Stripe success URL, poll once
  useEffect(() => {
    if (search.get("status") === "success" && status === "pending") {
      toast({
        title: "Pagamento em processamento",
        description: "Seu Pix está sendo confirmado. Pode levar alguns instantes.",
      });
    }
  }, [search, status, toast]);

  const startPayment = async () => {
    if (!poolId) return;
    setCreating(true);
    const { data, error } = await supabase.functions.invoke("create-pix-payment", {
      body: { pool_id: poolId },
    });
    setCreating(false);
    if (error) {
      toast({ title: "Erro ao iniciar pagamento", description: error.message, variant: "destructive" });
      return;
    }
    if (data?.already_paid) {
      setStatus("paid");
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
        <p className="text-foreground mb-4">Bolão não encontrado.</p>
        <Button variant="hero" onClick={() => navigate("/app")}>Voltar</Button>
      </div>
    );
  }

  const paid = status === "paid" || status === "exempt";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Mestre do Placar" className="h-16 w-16 mx-auto mb-3 rounded-xl shadow-lg" />
        </div>

        <div className="rounded-2xl p-6 bg-secondary border border-accent/15 shadow-gold-glow">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-accent" />
            <h1 className="font-display text-xl font-bold text-foreground">{pool.name}</h1>
          </div>

          {paid ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="h-14 w-14 text-accent mx-auto mb-3" />
              <h2 className="font-display text-lg font-bold text-foreground mb-1">Tudo certo!</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Sua entrada está confirmada. Boa sorte! 🍀
              </p>
              <Button variant="hero" size="lg" className="w-full" onClick={() => navigate("/app")}>
                Entrar no bolão
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-5">
                Para liberar seus palpites, finalize a taxa de entrada via Pix.
              </p>

              <div className="rounded-xl bg-primary/40 border border-accent/10 p-4 mb-5 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Taxa de entrada</p>
                <p className="font-display text-3xl font-bold text-accent">{formatFee(pool.entry_fee_cents)}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Pagamento único, vale toda a Copa</p>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full shadow-gold-glow"
                onClick={startPayment}
                disabled={creating}
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
                {creating ? "Gerando Pix..." : "Pagar com Pix"}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground mt-3">
                Você será redirecionado ao checkout seguro para escanear o QR Code.
              </p>
            </>
          )}

          <button
            className="flex items-center gap-1 mx-auto mt-6 text-xs text-muted-foreground hover:text-accent transition"
            onClick={() => navigate("/app")}
          >
            <ArrowLeft className="h-3 w-3" /> Voltar para meus bolões
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallPage;
