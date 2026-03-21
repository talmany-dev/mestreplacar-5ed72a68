import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Calendar, MessageCircle, User } from "lucide-react";
import MatchesTab from "@/components/app/MatchesTab";
import RankingTab from "@/components/app/RankingTab";
import ChatTab from "@/components/app/ChatTab";
import ProfileTab from "@/components/app/ProfileTab";
import logo from "@/assets/logo.png";

const AppPage = () => {
  const [activeTab, setActiveTab] = useState("matches");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar — glassmorphism */}
      <header className="glassmorphism px-4 py-3 flex items-center justify-between shrink-0 border-b border-gold/10">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded" />
          <span className="font-display text-lg text-gradient-gold">MESTRE DO PLACAR</span>
        </div>
        <div className="bg-secondary rounded-full px-3 py-1 text-xs font-semibold text-gold tabular-nums border border-gold/20">
          127 pts
        </div>
      </header>

      {/* Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="matches" className="mt-0 h-full"><MatchesTab /></TabsContent>
          <TabsContent value="ranking" className="mt-0 h-full"><RankingTab /></TabsContent>
          <TabsContent value="chat" className="mt-0 h-full"><ChatTab /></TabsContent>
          <TabsContent value="profile" className="mt-0 h-full"><ProfileTab /></TabsContent>
        </div>

        {/* Bottom tabs */}
        <TabsList className="shrink-0 h-16 bg-card border-t border-gold/10 rounded-none grid grid-cols-4 gap-0 p-0">
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
