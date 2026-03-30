import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";

interface JoinPoolDialogProps {
  onJoined: () => void;
  trigger?: React.ReactNode;
}

const JoinPoolDialog = ({ onJoined, trigger }: JoinPoolDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [password, setPassword] = useState("");

  const handleJoin = async () => {
    if (!user) return;
    if (!joinCode.trim() || !password.trim()) {
      toast({ title: "Preencha o código e a senha", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Find pool by join_code
    const { data: pool, error: poolError } = await supabase
      .from("pools")
      .select("id, access_password, max_players, name")
      .eq("join_code", joinCode.trim().toUpperCase())
      .single();

    if (poolError || !pool) {
      toast({ title: "Bolão não encontrado", description: "Verifique o código de convite.", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (pool.access_password !== password.trim()) {
      toast({ title: "Senha incorreta", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Check current member count
    const { count } = await supabase
      .from("pool_members")
      .select("*", { count: "exact", head: true })
      .eq("pool_id", pool.id);

    if (count !== null && count >= pool.max_players) {
      toast({ title: "Bolão lotado", description: "O limite de participantes foi atingido.", variant: "destructive" });
      setLoading(false);
      return;
    }

    // Join
    const { error: joinError } = await supabase.from("pool_members").insert({
      pool_id: pool.id,
      user_id: user.id,
      role: "player" as const,
    });

    if (joinError) {
      if (joinError.code === "23505") {
        toast({ title: "Você já participa deste bolão!", variant: "destructive" });
      } else {
        toast({ title: "Erro ao entrar no bolão", description: joinError.message, variant: "destructive" });
      }
      setLoading(false);
      return;
    }

    toast({ title: `Bem-vindo ao ${pool.name}! 🎉` });
    setOpen(false);
    setJoinCode("");
    setPassword("");
    onJoined();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-accent/20 text-accent hover:bg-accent/10">
            <LogIn className="h-4 w-4 mr-2" />
            Entrar em um Bolão
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-accent/10">
        <DialogHeader>
          <DialogTitle className="font-display text-gradient-gold">ENTRAR EM UM BOLÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Código de Convite</Label>
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              maxLength={6}
              className="mt-1 text-foreground bg-primary border-accent/15 uppercase tracking-widest text-center font-display text-lg"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Senha do Bolão</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="mt-1 text-foreground bg-primary border-accent/15"
            />
          </div>
          <Button
            variant="hero"
            className="w-full shadow-gold-glow"
            size="lg"
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar no Bolão"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPoolDialog;
