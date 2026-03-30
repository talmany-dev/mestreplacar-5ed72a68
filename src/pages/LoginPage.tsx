import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Erro ao entrar",
        description: error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({ title: "Bem-vindo de volta!", description: "Login realizado com sucesso." });
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Mestre do Placar" className="h-20 w-20 mx-auto mb-4 rounded-xl shadow-lg" />
          <h1 className="font-display text-2xl font-bold text-white">Entrar</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(216 30% 70%)" }}>Bem-vindo de volta, Mestre!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="pl-10 text-white placeholder:opacity-40 border"
                style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="pl-10 text-white placeholder:opacity-40 border"
                style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
          </div>
          <Button variant="hero" className="w-full shadow-gold-glow" size="lg" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "hsl(216 30% 65%)" }}>
          Não tem conta?{" "}
          <button onClick={() => navigate("/signup")} className="hover:underline font-medium" style={{ color: "hsl(43 50% 55%)" }}>Criar conta</button>
        </p>
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-xs mx-auto mt-4 transition-colors hover:text-white" style={{ color: "hsl(216 30% 55%)" }}>
          <ArrowLeft className="h-3 w-3" /> Voltar
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
