import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JoinPoolDialogProps {
  onJoined?: () => void;
  trigger?: React.ReactNode;
}

const JoinPoolDialog = ({ trigger }: JoinPoolDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleGo = () => {
    const raw = value.trim();
    if (!raw) {
      toast({ title: "Cole o link ou digite o código", variant: "destructive" });
      return;
    }
    // Accept either full URL (.../join/CODE) or raw 6-char code
    const match = raw.match(/\/join\/([A-Za-z0-9]+)/);
    const code = (match ? match[1] : raw).toUpperCase();
    setOpen(false);
    setValue("");
    navigate(`/join/${code}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="border-accent/20 text-accent hover:bg-accent/10">
            <LogIn className="h-4 w-4 mr-1" />
            Entrar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-card border-accent/10">
        <DialogHeader>
          <DialogTitle className="font-display text-gradient-gold">ENTRAR EM UM BOLÃO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Cole o link de convite ou código</Label>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://.../join/ABC123 ou ABC123"
              className="mt-1 text-foreground bg-primary border-accent/15"
            />
          </div>
          <Button variant="hero" className="w-full shadow-gold-glow" size="lg" onClick={handleGo}>
            Continuar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinPoolDialog;
