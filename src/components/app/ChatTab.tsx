import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

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
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
            {!msg.isYou && <span className="text-xs text-muted-foreground mb-0.5 ml-1">{msg.user}</span>}
            <div className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm ${msg.isYou ? "bg-navy text-primary-foreground/90 rounded-br-md" : "bg-card shadow-card rounded-bl-md text-foreground"}`}>
              {msg.text}
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5 mx-1">{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border bg-card flex gap-2">
        <Input
          placeholder="Manda a resenha..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1"
        />
        <Button size="icon" variant="gold" onClick={sendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
