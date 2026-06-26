import { useState } from "react";
import { X, Coins, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CategoryId = "quick" | "accessories" | "outfits" | "flats";

interface Gift {
  id: string;
  emoji: string;
  label: string;
  cost: number;
  bump: number;
  category: CategoryId;
  /** Client-only placeholder — backend doesn't sell this yet. */
  comingSoon?: boolean;
}

const CATEGORIES: { id: CategoryId; label: string; icon: string; tagline: string }[] = [
  { id: "quick",       label: "Quick",       icon: "💫", tagline: "Little flirts & sweet gestures" },
  { id: "accessories", label: "Accessories", icon: "💎", tagline: "Pretty things she'll wear" },
  { id: "outfits",     label: "Outfits",     icon: "👗", tagline: "Dress her up" },
  { id: "flats",       label: "Flats",       icon: "🏠", tagline: "A place of her own" },
];

const GIFTS: Gift[] = [
  // Quick
  { id: "wink",      emoji: "😉",  label: "Wink",      cost: 5,    bump: 5,   category: "quick" },
  { id: "rose",      emoji: "🌹",  label: "Rose",      cost: 10,   bump: 10,  category: "quick" },
  { id: "coffee",    emoji: "☕",  label: "Coffee",    cost: 15,   bump: 12,  category: "quick" },
  { id: "chocolate", emoji: "🍫",  label: "Chocolate", cost: 20,   bump: 18,  category: "quick" },
  { id: "teddy",     emoji: "🧸",  label: "Teddy",     cost: 40,   bump: 30,  category: "quick" },
  { id: "wine",      emoji: "🍷",  label: "Wine",      cost: 80,   bump: 60,  category: "quick" },

  // Accessories
  { id: "lipstick",  emoji: "💄",  label: "Lipstick",  cost: 30,   bump: 25,  category: "accessories" },
  { id: "perfume",   emoji: "🌸",  label: "Perfume",   cost: 60,   bump: 45,  category: "accessories" },
  { id: "necklace",  emoji: "📿",  label: "Necklace",  cost: 200,  bump: 90,  category: "accessories" },
  { id: "ring",      emoji: "💍",  label: "Ring",      cost: 500,  bump: 200, category: "accessories" },
  { id: "earrings",  emoji: "👂",  label: "Earrings",  cost: 150,  bump: 70,  category: "accessories", comingSoon: true },
  { id: "watch",     emoji: "⌚",  label: "Watch",     cost: 350,  bump: 140, category: "accessories", comingSoon: true },

  // Outfits
  { id: "lingerie",  emoji: "👙",  label: "Lingerie",  cost: 100,  bump: 50,  category: "outfits" },
  { id: "dress",     emoji: "👗",  label: "Dress",     cost: 180,  bump: 80,  category: "outfits", comingSoon: true },
  { id: "kimono",    emoji: "🎎",  label: "Kimono",    cost: 240,  bump: 95,  category: "outfits", comingSoon: true },
  { id: "bikini",    emoji: "👗",  label: "Bikini",    cost: 120,  bump: 60,  category: "outfits", comingSoon: true },
  { id: "heels",     emoji: "👠",  label: "Heels",     cost: 90,   bump: 45,  category: "outfits", comingSoon: true },
  { id: "fursuit",   emoji: "🐰",  label: "Bunny Suit",cost: 320,  bump: 130, category: "outfits", comingSoon: true },

  // Flats
  { id: "yacht",     emoji: "🛥️", label: "Yacht",     cost: 2000, bump: 500, category: "flats" },
  { id: "studio",    emoji: "🏙️", label: "Studio",    cost: 800,  bump: 220, category: "flats", comingSoon: true },
  { id: "loft",      emoji: "🏢",  label: "Loft",      cost: 1500, bump: 380, category: "flats", comingSoon: true },
  { id: "beachhouse",emoji: "🏖️", label: "Beach House",cost: 3000,bump: 700, category: "flats", comingSoon: true },
  { id: "villa",     emoji: "🏡",  label: "Villa",     cost: 5000, bump: 1000,category: "flats", comingSoon: true },
];

const GiftDrawer = ({
  open, onClose, balance, onPurchased,
}: { open: boolean; onClose: () => void; balance: number; onPurchased: () => void }) => {
  const [busy, setBusy] = useState<string | null>(null);
  const [cat, setCat] = useState<CategoryId>("quick");
  if (!open) return null;

  const buy = async (g: Gift) => {
    if (g.comingSoon) {
      toast.info("Coming soon");
      return;
    }
    setBusy(g.id);
    try {
      const { error } = await supabase.rpc("purchase_gift", { _companion_slug: "mina", _gift_id: g.id });
      if (error) throw error;
      toast.success(`She loved the ${g.label.toLowerCase()}`);
      onPurchased();
      onClose();
    } catch (e: any) {
      toast.error(e.message?.includes("insufficient") ? "Not enough tokens" : (e.message ?? "Failed"));
    } finally {
      setBusy(null);
    }
  };

  const activeCat = CATEGORIES.find((c) => c.id === cat)!;
  const items = GIFTS.filter((g) => g.category === cat);

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

        {/* Category tabs */}
        <div className="flex gap-1 p-1 mb-1 rounded-xl bg-white/[0.04] border border-white/5">
          {CATEGORIES.map((c) => {
            const active = c.id === cat;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`flex-1 h-9 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1.5 ${
                  active
                    ? "bg-white/15 text-white shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "text-white/45 hover:text-white/75"
                }`}
              >
                <span className="text-sm leading-none">{c.icon}</span>
                {c.label}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-white/40 italic mb-3 px-1">{activeCat.tagline}</p>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-y-auto pr-1 -mr-1">
          {items.map((g) => {
            const afford = balance >= g.cost;
            const isBusy = busy === g.id;
            const locked = !!g.comingSoon;
            return (
              <button
                key={g.id}
                onClick={() => buy(g)}
                disabled={(!afford && !locked) || busy !== null}
                className={`group relative aspect-square rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition ${
                  locked
                    ? "bg-white/[0.02] border-white/[0.06] opacity-50 cursor-default"
                    : afford
                      ? "bg-white/[0.05] hover:bg-white/[0.12] border-white/10 hover:border-white/30 hover:scale-[1.03]"
                      : "bg-white/[0.02] border-white/[0.06] opacity-40 cursor-not-allowed"
                } ${isBusy ? "ring-2 ring-white/40" : ""}`}
              >
                {locked && (
                  <span className="absolute top-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/40 border border-white/10 text-[8px] uppercase tracking-wider text-white/60">
                    <Lock className="w-2.5 h-2.5" /> Soon
                  </span>
                )}
                <div className="text-3xl leading-none">{g.emoji}</div>
                <div className="text-[11px] font-medium text-white/90 leading-tight">{g.label}</div>
                <div className="text-[10px] text-white/50 tabular-nums flex items-center gap-1">
                  <Coins className="w-2.5 h-2.5" /> {g.cost}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GiftDrawer;
