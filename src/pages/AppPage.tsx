import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, MessageCircle, User, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MatchesTab from "@/components/app/MatchesTab";
import RankingTab from "@/components/app/RankingTab";
import ChatTab from "@/components/app/ChatTab";
import ProfileTab from "@/components/app/ProfileTab";
import PoolList from "@/components/pool/PoolList";
import JoinPoolDialog from "@/components/pool/JoinPoolDialog";
import logo from "@/assets/logo.png";
import logoSecondary from "@/assets/logo-secondary.png";

interface SelectedPool {
  id: string;
  name: string;
}

const AppPage = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [poolRefreshKey, setPoolRefreshKey] = useState(0);
  const [selectedPool, setSelectedPool] = useState<SelectedPool | null>(null);
  const navigate = useNavigate();

  // Pool view — tabs scoped to the selected pool
  if (selectedPool) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="glassmorphism px-4 py-3 flex items-center gap-3 shrink-0 border-b border-gold/10 safe-top">
          <button
            onClick={() => { setSelectedPool(null); setActiveTab("matches"); }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Bolão</p>
            <h1 className="font-display text-base font-bold text-gradient-gold truncate">{selectedPool.name}</h1>
          </div>
          <img src={logo} alt="Mestre do Placar" className="h-9 w-9 rounded-lg" />
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto pb-16">
            <TabsContent value="matches" className="mt-0 h-full">
              <MatchesTab poolId={selectedPool.id} />
            </TabsContent>
            <TabsContent value="ranking" className="mt-0 h-full">
              <RankingTab poolId={selectedPool.id} />
            </TabsContent>
            <TabsContent value="chat" className="mt-0 h-full">
              <ChatTab poolId={selectedPool.id} />
            </TabsContent>
            <TabsContent value="profile" className="mt-0 h-full">
              <ProfileTab />
            </TabsContent>
          </div>

          <TabsList className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-gold/10 rounded-none grid grid-cols-4 gap-0 p-0 safe-bottom">
            {[
              { value: "matches", icon: Calendar, label: "Jogos" },
              { value: "ranking", icon: Trophy, label: "Ranking" },
              { value: "chat", icon: MessageCircle, label: "Chat" },
              { value: "profile", icon: User, label: "Perfil" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center justify-center gap-1 rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gold text-muted-foreground"
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    );
  }

  // Home view — pool list
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="glassmorphism px-4 py-3 flex items-center justify-between shrink-0 border-b border-gold/10 safe-top">
        <img src={logoSecondary} alt="Mestre do Placar" className="h-16 object-contain" />
        <div className="flex items-center gap-2">
          <JoinPoolDialog onJoined={() => setPoolRefreshKey((k) => k + 1)} />
          <Button variant="gold" size="sm" onClick={() => navigate("/create-pool")}>
            <Plus className="h-4 w-4 mr-1" />
            Criar Bolão
          </Button>
        </div>
      </header>

      <div className="px-4 pt-4 pb-4 flex-1">
        <h2 className="font-display text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">
          Meus Bolões
        </h2>
        <p className="text-xs text-muted-foreground mb-4">Toque em um bolão para ver palpites, ranking e chat.</p>
        <PoolList
          refreshKey={poolRefreshKey}
          onSelectPool={(id, name) => setSelectedPool({ id, name })}
        />
      </div>

      {/* Profile tab accessible from home */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-gold/10 flex items-center justify-end px-4 safe-bottom">
        <button
          onClick={() => {
            setSelectedPool({ id: "__profile__", name: "" });
            setActiveTab("profile");
          }}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
        >
          <User className="h-5 w-5" />
          <span className="text-[11px] font-medium">Perfil</span>
        </button>
      </div>
    </div>
  );
};

export default AppPage;
