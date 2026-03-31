import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Conta criada!",
      description: "Bem-vindo ao Mestre do Placar!",
    });
    navigate(redirectParam ? redirectParam : "/app");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Mestre do Placar" className="h-20 w-20 mx-auto mb-4 rounded-xl shadow-lg" />
          <h1 className="font-display text-2xl font-bold text-white">Criar Conta</h1>
          <p className="text-sm mt-1" style={{ color: "hsl(216 30% 70%)" }}>Entre na resenha da Copa 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
              <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required
                className="pl-10 text-white placeholder:opacity-40 border"
                style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
          </div>
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
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="pl-10 text-white placeholder:opacity-40 border"
                style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
          </div>
          <Button variant="hero" className="w-full shadow-gold-glow" size="lg" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "hsl(216 30% 65%)" }}>
          Já tem conta?{" "}
          <button onClick={() => navigate(`/login${redirectParam ? `?redirect=${redirectParam}` : ""}`)} className="hover:underline font-medium" style={{ color: "hsl(43 50% 55%)" }}>Entrar</button>
        </p>
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-xs mx-auto mt-4 transition-colors hover:text-white" style={{ color: "hsl(216 30% 55%)" }}>
          <ArrowLeft className="h-3 w-3" /> Voltar
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
