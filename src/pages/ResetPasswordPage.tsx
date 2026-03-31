import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    setRecoveryMode(window.location.hash.includes("type=recovery"));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || window.location.hash.includes("type=recovery")) {
        setRecoveryMode(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (recoveryMode) {
      if (password.length < 6) {
        toast({
          title: "Senha muito curta",
          description: "Use pelo menos 6 caracteres.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "As senhas não conferem",
          description: "Digite a mesma senha nos dois campos.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Senha atualizada!",
        description: "Agora você já pode entrar com a nova senha.",
      });
      navigate("/login", { replace: true });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao enviar link",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Link enviado",
      description: "Verifique seu e-mail para redefinir a senha.",
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}
    >
      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <img src={logo} alt="Mestre do Placar" className="h-20 w-20 mx-auto mb-4 rounded-xl shadow-lg" />
          <h1 className="font-display text-2xl font-bold text-white">
            {recoveryMode ? "Nova Senha" : "Recuperar Acesso"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "hsl(216 30% 70%)" }}>
            {recoveryMode
              ? "Defina uma nova senha para sua conta"
              : "Enviaremos um link para você redefinir sua senha"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {recoveryMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>
                  Nova senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 text-white placeholder:opacity-40 border"
                    style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-10 text-white placeholder:opacity-40 border"
                    style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm" style={{ color: "hsl(216 30% 70%)" }}>
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "hsl(216 30% 55%)" }} />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 text-white placeholder:opacity-40 border"
                  style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }}
                />
              </div>
            </div>
          )}

          <Button variant="hero" className="w-full shadow-gold-glow" size="lg" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {recoveryMode ? "Salvar nova senha" : "Enviar link"}
          </Button>
        </form>

        <button
          onClick={() => navigate(`/login${email ? `?email=${encodeURIComponent(email)}` : ""}`)}
          className="flex items-center gap-1 text-xs mx-auto mt-4 transition-colors hover:text-white"
          style={{ color: "hsl(216 30% 55%)" }}
        >
          <ArrowLeft className="h-3 w-3" /> Voltar para login
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;