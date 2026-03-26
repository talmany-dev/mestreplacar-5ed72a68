import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Trophy, Target, Star, Shield, User } from "lucide-react";

const ProfileTab = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5 text-center">
          <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-gold/30" style={{ background: 'hsl(216 55% 32%)' }}>
            <span className="font-display text-3xl font-bold text-gold">VP</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">Você Player</h2>
          <p className="text-xs text-muted-foreground mt-0.5">voce@email.com</p>
          <Badge className="mt-2 bg-gold/10 text-gold border-gold/20" variant="outline">
            Série A • 4º lugar
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 px-4 mt-4">
        {[
          { icon: Trophy, label: "Pontos", value: "127" },
          { icon: Target, label: "Acertos Exatos", value: "3" },
          { icon: Star, label: "Jogos Dourados", value: "2/5" },
          { icon: Shield, label: "Rodadas", value: "5" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 border border-gold/10 text-center"
            style={{ background: 'hsl(216 60% 25%)' }}
          >
            <stat.icon className="h-5 w-5 mx-auto mb-1.5 text-gold" />
            <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2 px-4 mt-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-gold/10 text-foreground hover:bg-gold/5"
          onClick={() => navigate("/admin")}
          style={{ background: 'hsl(216 60% 25%)' }}
        >
          <Settings className="h-4 w-4 text-gold" /> Painel Admin
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          onClick={() => navigate("/")}
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
