import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ChatTabProps {
  poolId: string;
}

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
  isYou?: boolean;
}

const ChatTab = ({ poolId }: ChatTabProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages and subscribe to realtime
  useEffect(() => {
    if (!poolId) return;

    const loadMessages = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("messages")
        .select("id, user_id, content, created_at, profiles(full_name)")
        .eq("pool_id", poolId)
        .order("created_at", { ascending: true })
        .limit(100);

      if (data) {
        setMessages(
          data.map((m: any) => ({
            id: m.id,
            user_id: m.user_id,
            content: m.content,
            created_at: m.created_at,
            sender_name: m.profiles?.full_name || "Participante",
            isYou: m.user_id === user?.id,
          }))
        );
      }
      setLoading(false);
    };

    loadMessages();

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${poolId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `pool_id=eq.${poolId}` },
        async (payload) => {
          const newMsg = payload.new as any;
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", newMsg.user_id)
            .maybeSingle();
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              user_id: newMsg.user_id,
              content: newMsg.content,
              created_at: newMsg.created_at,
              sender_name: profile?.full_name || "Participante",
              isYou: newMsg.user_id === user?.id,
            },
          ]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [poolId, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");

    const { error } = await supabase
      .from("messages")
      .insert({ pool_id: poolId, user_id: user.id, content });

    if (error) {
      setInput(content); // restore on error
    }
    setSending(false);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden shrink-0" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-wider">Bate-Papo</span>
          </div>
          <h2 className="font-display text-lg font-bold text-foreground mt-1">Resenha do Bolão</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Seja o primeiro a mandar a resenha!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isYou ? "items-end" : "items-start"}`}>
              {!msg.isYou && (
                <span className="text-xs text-muted-foreground mb-0.5 ml-1">{msg.sender_name}</span>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 max-w-[80%] text-sm border ${
                  msg.isYou ? "rounded-br-md border-gold/20" : "rounded-bl-md border-gold/10"
                } text-foreground`}
                style={{ background: msg.isYou ? 'hsla(40,40%,55%,0.1)' : 'hsl(216 60% 25%)' }}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 mx-1">{formatTime(msg.created_at)}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gold/10 flex gap-2 shrink-0" style={{ background: 'hsl(216 60% 25%)' }}>
        <Input
          placeholder="Manda a resenha..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          maxLength={500}
          className="flex-1 bg-secondary border-gold/10 text-foreground placeholder:text-muted-foreground"
        />
        <Button size="icon" variant="gold" onClick={sendMessage} disabled={sending || !input.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatTab;
