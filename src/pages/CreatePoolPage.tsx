import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CreatePoolForm from "@/components/pool/CreatePoolForm";

const CreatePoolPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(216 70% 15%), hsl(216 67% 28%), hsl(216 60% 20%))" }}>
      <header className="px-4 py-3 flex items-center gap-3 border-b border-accent/10 glassmorphism">
        <button onClick={() => navigate("/app")} className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg text-gradient-gold">CRIAR BOLÃO</h1>
      </header>

      <div className="p-4 max-w-lg mx-auto">
        <CreatePoolForm onCreated={() => navigate("/app")} />
      </div>
    </div>
  );
};

export default CreatePoolPage;
