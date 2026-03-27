import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Users, Trophy, Settings2, Gift } from "lucide-react";
import { useState } from "react";

const SCORING_RULES = [
  { label: "Placar Exato", pts: 25 },
  { label: "Vencedor + Saldo de Gols", pts: 18 },
  { label: "Vencedor / Empate", pts: 10 },
  { label: "Gols de um Time", pts: 5 },
  { label: "Previsão de Campeão", pts: 50 },
];

const MEMBERS = [
  { name: "Carlos M.", status: "approved" },
  { name: "Ana Paula", status: "approved" },
  { name: "Rodrigo S.", status: "approved" },
  { name: "Fernanda L.", status: "pending" },
  { name: "Pedro H.", status: "pending" },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const inviteLink = "mestreplacar.app/invite/abc123";

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <header className="px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: "hsl(43 50% 55% / 0.1)", background: "hsl(216 60% 18% / 0.8)", backdropFilter: "blur(12px)" }}>
        <button onClick={() => navigate("/app")} className="transition-colors" style={{ color: "hsl(216 30% 60%)" }}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg text-gradient-gold">PAINEL ADMIN</h1>
      </header>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Scoring Rules */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="h-4 w-4" style={{ color: "hsl(43 50% 55%)" }} />
            <h2 className="font-display text-lg font-bold text-white">Regras de Pontuação</h2>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(216 60% 25%)", border: "1px solid hsl(43 50% 55% / 0.1)" }}>
            {SCORING_RULES.map((rule, i) => (
              <div key={rule.label} className={`flex items-center justify-between px-4 py-3`} style={i < SCORING_RULES.length - 1 ? { borderBottom: "1px solid hsl(216 50% 30%)" } : {}}>
                <span className="text-sm text-white">{rule.label}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue={rule.pts}
                    className="w-16 h-8 text-center text-sm font-display font-bold text-white border"
                    style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }}
                  />
                  <span className="text-xs" style={{ color: "hsl(216 30% 55%)" }}>pts</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prize */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4" style={{ color: "hsl(43 50% 55%)" }} />
            <h2 className="font-display text-lg font-bold text-white">Premiação</h2>
          </div>
          <div className="rounded-xl p-4 space-y-3" style={{ background: "hsl(216 60% 25%)", border: "1px solid hsl(43 50% 55% / 0.1)" }}>
            <div>
              <Label className="text-xs" style={{ color: "hsl(216 30% 65%)" }}>1º Lugar</Label>
              <Input defaultValue="70% do prêmio" className="mt-1 text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
            <div>
              <Label className="text-xs" style={{ color: "hsl(216 30% 65%)" }}>2º Lugar</Label>
              <Input defaultValue="20% do prêmio" className="mt-1 text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
            <div>
              <Label className="text-xs" style={{ color: "hsl(216 30% 65%)" }}>3º Lugar</Label>
              <Input defaultValue="10% do prêmio" className="mt-1 text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
          </div>
        </section>

        {/* Invite Link */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" style={{ color: "hsl(43 50% 55%)" }} />
            <h2 className="font-display text-lg font-bold text-white">Convite</h2>
          </div>
          <div className="rounded-xl p-4" style={{ background: "hsl(216 60% 25%)", border: "1px solid hsl(43 50% 55% / 0.1)" }}>
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly className="text-sm flex-1 text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
              <Button variant="gold" size="icon" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </section>

        {/* Members */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4" style={{ color: "hsl(43 50% 55%)" }} />
            <h2 className="font-display text-lg font-bold text-white">Membros ({MEMBERS.length})</h2>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "hsl(216 60% 25%)", border: "1px solid hsl(43 50% 55% / 0.1)" }}>
            {MEMBERS.map((member, i) => (
              <div key={member.name} className={`flex items-center justify-between px-4 py-3`} style={i < MEMBERS.length - 1 ? { borderBottom: "1px solid hsl(216 50% 30%)" } : {}}>
                <span className="text-sm text-white">{member.name}</span>
                {member.status === "pending" ? (
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="gold" className="h-7 text-xs">Aprovar</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive">Recusar</Button>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs" style={{ color: "hsl(43 50% 55%)", borderColor: "hsl(43 50% 55% / 0.2)", background: "hsl(43 50% 55% / 0.05)" }}>Ativo</Badge>
                )}
              </div>
            ))}
          </div>
        </section>

        <Button variant="hero" className="w-full shadow-gold-glow" size="lg">
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
