import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Trophy, Target, Star, Shield, Save, Trash2, Key, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfileTab = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user!.id)
      .single();
    if (data) {
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq("id", user!.id);
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Perfil atualizado!" });
      setEditMode(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Senha muito curta", description: "Mínimo 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao trocar senha", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha alterada com sucesso!" });
      setNewPassword("");
    }
  };

  const deleteAccount = async () => {
    // User deletes their profile; the CASCADE on auth.users handles cleanup
    setLoading(true);
    const { error } = await supabase.from("profiles").delete().eq("id", user!.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    await signOut();
    navigate("/");
    toast({ title: "Conta excluída", description: "Seus dados foram removidos." });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="pb-4">
      {/* Hero Banner */}
      <div className="relative mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(216 70% 20%), hsl(216 67% 32%), hsl(216 60% 25%))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsla(40,40%,55%,0.15),transparent_60%)]" />
        <div className="relative p-5 text-center">
          <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-gold/30" style={{ background: 'hsl(216 55% 32%)' }}>
            <span className="font-display text-3xl font-bold text-gold">{initials}</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground">{fullName || "Jogador"}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
          <Badge className="mt-2 bg-gold/10 text-gold border-gold/20" variant="outline">
            Série A • 4º lugar
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 px-4 mt-4">
        {[
          { icon: Trophy, label: "Pontos", value: "127" },
          { icon: Target, label: "Acertos Exatos", value: "3" },
          { icon: Star, label: "Jogos Dourados", value: "2/5" },
          { icon: Shield, label: "Rodadas", value: "5" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4 border border-gold/10 text-center" style={{ background: 'hsl(216 60% 25%)' }}>
            <stat.icon className="h-5 w-5 mx-auto mb-1.5 text-gold" />
            <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Edit Profile */}
      <div className="px-4 mt-4 space-y-3">
        {editMode ? (
          <div className="rounded-xl p-4 border border-gold/10 space-y-3" style={{ background: 'hsl(216 60% 25%)' }}>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">URL do Avatar</Label>
              <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..."
                className="text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveProfile} disabled={loading} className="flex-1 bg-gold text-background hover:bg-gold/90">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />} Salvar
              </Button>
              <Button variant="outline" onClick={() => setEditMode(false)} className="border-gold/10">Cancelar</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full justify-start gap-2 border-gold/10 text-foreground hover:bg-gold/5"
            onClick={() => setEditMode(true)} style={{ background: 'hsl(216 60% 25%)' }}>
            <Settings className="h-4 w-4 text-gold" /> Editar Perfil
          </Button>
        )}

        {/* Change Password */}
        <div className="rounded-xl p-4 border border-gold/10 space-y-3" style={{ background: 'hsl(216 60% 25%)' }}>
          <Label className="text-xs text-muted-foreground flex items-center gap-1"><Key className="h-3 w-3" /> Trocar Senha</Label>
          <Input type="password" placeholder="Nova senha (mín. 6 caracteres)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="text-white border" style={{ background: "hsl(216 60% 22%)", borderColor: "hsl(43 50% 55% / 0.15)" }} />
          <Button onClick={changePassword} disabled={loading || !newPassword} size="sm" className="bg-gold text-background hover:bg-gold/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null} Alterar Senha
          </Button>
        </div>

        {/* Admin */}
        <Button variant="outline" className="w-full justify-start gap-2 border-gold/10 text-foreground hover:bg-gold/5"
          onClick={() => navigate("/admin")} style={{ background: 'hsl(216 60% 25%)' }}>
          <Settings className="h-4 w-4 text-gold" /> Painel Admin
        </Button>

        {/* Sign Out */}
        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sair
        </Button>

        {/* Delete Account */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 text-destructive/70 hover:text-destructive text-xs">
              <Trash2 className="h-3.5 w-3.5" /> Excluir minha conta (LGPD)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground">
                Excluir Conta
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProfileTab;
