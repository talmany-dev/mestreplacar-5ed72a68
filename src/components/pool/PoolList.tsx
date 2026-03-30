import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Users, Copy, Check, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pool {
  id: string;
  name: string;
  join_code: string;
  max_players: number;
  prize_info: string | null;
  owner_id: string;
  member_count?: number;
  role?: string;
}

interface PoolListProps {
  refreshKey: number;
}

const PoolList = ({ refreshKey }: PoolListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchPools = async () => {
    if (!user) return;

    const { data: memberships } = await supabase
      .from("pool_members")
      .select("pool_id, role")
      .eq("user_id", user.id);

    if (!memberships?.length) {
      setPools([]);
      setLoading(false);
      return;
    }

    const poolIds = memberships.map((m) => m.pool_id);

    const { data: poolsData } = await supabase
      .from("pools")
      .select("*")
      .in("id", poolIds);

    if (poolsData) {
      // Get member counts
      const poolsWithMeta = await Promise.all(
        poolsData.map(async (pool) => {
          const { count } = await supabase
            .from("pool_members")
            .select("*", { count: "exact", head: true })
            .eq("pool_id", pool.id);

          const membership = memberships.find((m) => m.pool_id === pool.id);
          return { ...pool, member_count: count ?? 0, role: membership?.role };
        })
      );
      setPools(poolsWithMeta);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPools();
  }, [user, refreshKey]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deletePool = async (poolId: string) => {
    if (!confirm("Tem certeza que deseja excluir este bolão? Esta ação não pode ser desfeita.")) return;

    const { error } = await supabase.from("pools").delete().eq("id", poolId);
    if (error) {
      toast({ title: "Erro ao excluir bolão", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bolão excluído com sucesso" });
      fetchPools();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
      </div>
    );
  }

  if (!pools.length) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Você ainda não participa de nenhum bolão.</p>
        <p className="text-muted-foreground/60 text-xs mt-1">Crie um novo ou entre com um código de convite!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pools.map((pool) => (
        <Card key={pool.id} className="bg-secondary border-accent/10">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display font-bold text-foreground">{pool.name}</h3>
                {pool.prize_info && (
                  <p className="text-xs text-muted-foreground mt-0.5">{pool.prize_info}</p>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-xs border-accent/20 text-accent bg-accent/5"
              >
                {pool.role === "admin" ? "Admin" : "Jogador"}
              </Badge>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {pool.member_count}/{pool.max_players}
                </span>
                <span className="font-mono text-accent/80 tracking-wider">{pool.join_code}</span>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-accent"
                  onClick={() => copyCode(pool.join_code, pool.id)}
                >
                  {copiedId === pool.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
                {pool.role === "admin" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deletePool(pool.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PoolList;
