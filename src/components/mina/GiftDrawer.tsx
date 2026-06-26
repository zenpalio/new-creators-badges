import { useState } from "react";
import { X, Coins } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GIFTS = [
  { id: "wink",      emoji: "😉", label: "Wink",      cost: 5,    bump: 5 },
  { id: "rose",      emoji: "🌹", label: "Rose",      cost: 10,   bump: 10 },
  { id: "coffee",    emoji: "☕", label: "Coffee",    cost: 15,   bump: 12 },
  { id: "chocolate", emoji: "🍫", label: "Chocolate", cost: 20,   bump: 18 },
  { id: "lipstick",  emoji: "💄", label: "Lipstick",  cost: 30,   bump: 25 },
  { id: "teddy",     emoji: "🧸", label: "Teddy",     cost: 40,   bump: 30 },
  { id: "perfume",   emoji: "🌸", label: "Perfume",   cost: 60,   bump: 45 },
  { id: "wine",      emoji: "🍷", label: "Wine",      cost: 80,   bump: 60 },
  { id: "lingerie",  emoji: "👙", label: "Lingerie",  cost: 100,  bump: 50 },
  { id: "necklace",  emoji: "📿", label: "Necklace",  cost: 200,  bump: 90 },
  { id: "ring",      emoji: "💍", label: "Ring",      cost: 500,  bump: 200 },
  { id: "yacht",     emoji: "🛥️", label: "Yacht",    cost: 2000, bump: 500 },
];

const GiftDrawer = ({
  open, onClose, balance, onPurchased,
}: { open: boolean; onClose: () => void; balance: number; onPurchased: () => void }) => {
  const [busy, setBusy] = useState<string | null>(null);
  if (!open) return null;

  const buy = async (id: string) => {
    setBusy(id);
    try {
      const { error } = await supabase.rpc("purchase_gift", { _companion_slug: "mina", _gift_id: id });
      if (error) throw error;
      toast.success(`She loved the ${id}`);
      onPurchased();
      onClose();
    } catch (e: any) {
      toast.error(e.message?.includes("insufficient") ? "Not enough tokens" : (e.message ?? "Failed"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[85vh] flex flex-col bg-white/[0.07] backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-t-3xl sm:rounded-3xl p-5 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-white/95">Give Mina a gift</h3>
            <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
              <Coins className="w-3 h-3" /> {balance} tokens
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-white/70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto pr-1 -mr-1">
          {GIFTS.map((g) => {
            const afford = balance >= g.cost;
            const isBusy = busy === g.id;
            return (
              <button
                key={g.id}
                onClick={() => buy(g.id)}
                disabled={!afford || busy !== null}
                className={`group relative aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition ${
                  afford
                    ? "bg-white/[0.05] hover:bg-white/[0.12] border-white/10 hover:border-white/30 hover:scale-[1.03]"
                    : "bg-white/[0.02] border-white/[0.06] opacity-40 cursor-not-allowed"
                } ${isBusy ? "ring-2 ring-white/40" : ""}`}
              >
                <div className="text-3xl leading-none">{g.emoji}</div>
                <div className="text-[11px] font-medium text-white/90 leading-tight">{g.label}</div>
                <div className="text-[10px] text-white/50 tabular-nums">{g.cost}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GiftDrawer;
