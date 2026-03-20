import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup — navigate to app
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={logo} alt="Mestre do Placar" className="h-20 w-20 mx-auto mb-4 rounded-xl" />
          <h1 className="font-display text-2xl font-bold text-primary-foreground/90">Criar Conta</h1>
          <p className="text-sm text-primary-foreground/40 mt-1">Entre na resenha da Copa 2026</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary-foreground/60 text-sm">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/30" />
              <Input id="name" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}
                className="pl-10 bg-navy-light/40 border-primary-foreground/10 text-primary-foreground/90 placeholder:text-primary-foreground/20 focus:border-gold/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-foreground/60 text-sm">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/30" />
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-navy-light/40 border-primary-foreground/10 text-primary-foreground/90 placeholder:text-primary-foreground/20 focus:border-gold/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-primary-foreground/60 text-sm">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/30" />
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-navy-light/40 border-primary-foreground/10 text-primary-foreground/90 placeholder:text-primary-foreground/20 focus:border-gold/50" />
            </div>
          </div>
          <Button variant="hero" className="w-full" size="lg" type="submit">
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-primary-foreground/40 mt-6">
          Já tem conta?{" "}
          <button onClick={() => navigate("/login")} className="text-gold hover:underline font-medium">Entrar</button>
        </p>
        <button onClick={() => navigate("/")} className="flex items-center gap-1 text-xs text-primary-foreground/30 hover:text-primary-foreground/60 mx-auto mt-4 transition-colors">
          <ArrowLeft className="h-3 w-3" /> Voltar
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
