import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, MessageCircle, User, Plus } from "lucide-react";
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

const AppPage = () => {
  const [activeTab, setActiveTab] = useState("matches");
  const [poolRefreshKey, setPoolRefreshKey] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar — glassmorphism */}
      <header className="glassmorphism px-4 py-3 flex items-center justify-between shrink-0 border-b border-gold/10">
        <img src={logoSecondary} alt="Mestre do Placar" className="h-16 object-contain" />
        <div className="flex items-center gap-2">
          <JoinPoolDialog onJoined={() => setPoolRefreshKey((k) => k + 1)} />
          <Button variant="gold" size="sm" onClick={() => navigate("/create-pool")}>
            <Plus className="h-4 w-4 mr-1" />
            Criar Bolão
          </Button>
        </div>
      </header>

      {/* Pool List */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-display text-sm font-bold text-muted-foreground mb-2 uppercase tracking-wider">Meus Bolões</h2>
        <PoolList refreshKey={poolRefreshKey} />
      </div>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto pb-16">
          <TabsContent value="matches" className="mt-0 h-full"><MatchesTab /></TabsContent>
          <TabsContent value="ranking" className="mt-0 h-full"><RankingTab /></TabsContent>
          <TabsContent value="chat" className="mt-0 h-full"><ChatTab /></TabsContent>
          <TabsContent value="profile" className="mt-0 h-full"><ProfileTab /></TabsContent>
        </div>

        {/* Bottom tabs */}
        <TabsList className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-card border-t border-gold/10 rounded-none grid grid-cols-4 gap-0 p-0">
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
};

export default AppPage;
