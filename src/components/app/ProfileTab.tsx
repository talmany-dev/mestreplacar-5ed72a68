import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Trophy, Target, Star, Shield } from "lucide-react";

const ProfileTab = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* Profile header */}
      <div className="bg-card rounded-xl p-5 shadow-card text-center">
        <div className="h-16 w-16 rounded-full bg-navy flex items-center justify-center mx-auto mb-3">
          <span className="font-display text-2xl font-bold text-gold">VP</span>
        </div>
        <h2 className="font-display text-xl font-bold text-foreground">Você Player</h2>
        <p className="text-sm text-muted-foreground">voce@email.com</p>
        <Badge className="mt-2 bg-gold/10 text-gold-dark border-gold/30" variant="outline">
          Série A • 4º lugar
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Trophy, label: "Pontos", value: "127" },
          { icon: Target, label: "Acertos Exatos", value: "3" },
          { icon: Star, label: "Jogos Dourados", value: "2/5" },
          { icon: Shield, label: "Rodadas", value: "5" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 shadow-card text-center">
            <stat.icon className="h-5 w-5 mx-auto mb-1.5 text-grass" />
            <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/admin")}>
          <Settings className="h-4 w-4" /> Painel Admin
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={() => navigate("/")}>
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
