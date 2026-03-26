import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Users } from "lucide-react";

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isYou?: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: "1", user: "Carlos M.", text: "Brasil vai de 3x0 hoje! 🇧🇷🔥", time: "15:42" },
  { id: "2", user: "Ana Paula", text: "Exagerado kkk acho que 2x1", time: "15:43" },
  { id: "3", user: "Você", text: "Quero ver quem vai ter coragem de botar Argentina pra perder", time: "15:44", isYou: true },
  { id: "4", user: "Rodrigo S.", text: "Jogo Dourado no Brasil, quem mais?", time: "15:45" },
  { id: "5", user: "Fernanda L.", text: "Bora que essa rodada eu subo pra Série A! 💪", time: "15:47" },
];

const ChatTab = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), user: "Você", text: input, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), isYou: true },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Bate-Papo</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-0.5">
            Resenha do Bolão
          </h2>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            Troque ideias, provocações e palpites com os participantes.
          </p>
          <div className="flex items-center gap-1.5 bg-gold/10 rounded-lg px-3 py-1.5 border border-gold/20 w-fit">
            <Users className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-semibold text-gold">12 online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
            {!msg.isYou && <span className="text-xs text-muted-foreground mb-0.5 ml-1">{msg.user}</span>}
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm border ${
                msg.isYou
                  ? "rounded-br-md border-gold/20 text-foreground"
                  : "rounded-bl-md border-gold/10 text-foreground"
              }`}
              style={{ background: msg.isYou ? 'hsla(40,40%,55%,0.1)' : 'hsl(216 60% 25%)' }}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 mx-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gold/10 flex gap-2" style={{ background: 'hsl(216 60% 25%)' }}>
        <Input
          placeholder="Manda a resenha..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-secondary border-gold/10 text-foreground placeholder:text-muted-foreground"
        />
        <Button size="icon" variant="gold" onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
