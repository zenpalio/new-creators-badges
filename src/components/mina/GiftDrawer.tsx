import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GIFTS = [
  { id: "rose",     emoji: "🌹", label: "Rose",     cost: 10,  bump: 10 },
  { id: "lipstick", emoji: "💄", label: "Lipstick", cost: 30,  bump: 25 },
  { id: "lingerie", emoji: "👙", label: "Lingerie", cost: 100, bump: 50 },
  { id: "ring",     emoji: "💎", label: "Ring",     cost: 500, bump: 200 },
];

const GiftDrawer = ({ open, onClose, balance, onPurchased }: { open: boolean; onClose: () => void; balance: number; onPurchased: () => void }) => {
  const [busy, setBusy] = useState<string | null>(null);
  if (!open) return null;

  const buy = async (id: string) => {
    setBusy(id);
    try {
      const { error } = await supabase.rpc("purchase_gift", { _companion_slug: "mina", _gift_id: id });
      if (error) throw error;
      toast.success(`She loved the ${id} 💋`);
      onPurchased();
      onClose();
    } catch (e: any) {
      toast.error(e.message?.includes("insufficient") ? "Not enough tokens" : (e.message ?? "Failed"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-card-v2 rounded-t-3xl sm:rounded-3xl border border-border-v2/50 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground-v2">Give Mina a gift</h3>
            <p className="text-xs text-muted-v2-foreground">Balance: {balance} 🪙</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted-v2 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GIFTS.map((g) => {
            const afford = balance >= g.cost;
            return (
              <button
                key={g.id}
                onClick={() => buy(g.id)}
                disabled={!afford || busy !== null}
                className={`rounded-2xl p-4 border text-left transition ${
                  afford
                    ? "border-border-v2/40 bg-muted-v2/30 hover:bg-muted-v2/60 hover:border-red-500/40"
                    : "border-border-v2/20 bg-muted-v2/10 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="text-3xl mb-2">{g.emoji}</div>
                <div className="font-semibold text-sm text-foreground-v2">{g.label}</div>
                <div className="text-xs text-muted-v2-foreground mt-1">{g.cost} 🪙 · +{g.bump} ❤️</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GiftDrawer;
