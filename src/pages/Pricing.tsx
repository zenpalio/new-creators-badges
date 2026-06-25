import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Minus, ArrowUpRight, Flame, Image as ImageIcon, Video, Star, Shield, RefreshCw, Lock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import heroAsset from "@/assets/pricing-hero.jpeg.asset.json";
const heroImage = heroAsset.url;

type TabKey = "subscriptions" | "addons";

type BillingKey = "monthly" | "quarterly";

const plans = [
  {
    id: "premium",
    name: "Premium",
    tagline: "Deeper interactions, faster generation, priority access.",
    monthly: { price: "€14.99", originalPrice: null, note: "Billed monthly · Money-back guarantee", saveLabel: null },
    quarterly: { price: "€8.99", originalPrice: "€14.99", note: "€26.97 billed every 3 months", saveLabel: "Save 40%" },
    cta: "Go Premium",
    highlight: false,
    socialProof: "Join 12,000+ creators",
    features: [
      "Up to 500 monthly tokens",
      "Unlimited Chat & Roleplay",
      "Up to 500 Spicy Images",
      "Up to 100 Videos",
      "Create Unlimited Babes",
      "Create Unlimited Stories",
    ],
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "For creators who generate frequently with premium performance.",
    monthly: { price: "€29.99", originalPrice: null, note: "Billed monthly · +400 token bonus", saveLabel: "+400 bonus" },
    quarterly: { price: "€17.99", originalPrice: "€29.99", note: "€53.97 billed every 3 months · +400 token bonus", saveLabel: "Save 40%" },
    cta: "Go Ultra",
    highlight: true,
    socialProof: "Most chosen by power users",
    features: [
      "Up to 900 monthly tokens",
      "Unlimited Chat with long memory",
      "Up to 900 Spicy Images",
      "Up to 300 AI Videos",
      "Create Unlimited Babes",
      "Create Unlimited Stories",
    ],
  },
];


type Row = { label: string; premium: string | boolean; ultra: string | boolean; addons: string | boolean };

const compareRows: { group: string; rows: Row[] }[] = [
  {
    group: "Tokens & limits",
    rows: [
      { label: "Monthly tokens", premium: "200", ultra: "600", addons: "—" },
      { label: "Daily claims", premium: "10", ultra: "10", addons: "—" },
      { label: "Babe creation", premium: "Unlimited", ultra: "Unlimited", addons: "Unlimited" },
      { label: "Queue priority", premium: "Medium", ultra: "High", addons: "Low" },
      { label: "Create stories", premium: "Unlimited", ultra: "Unlimited", addons: "Unlimited" },
      { label: "Unlock stories", premium: true, ultra: true, addons: true },
    ],
  },
  {
    group: "Generation",
    rows: [
      { label: "Concurrent video generations", premium: "1×", ultra: "2×", addons: "1×" },
      { label: "Concurrent image generations", premium: "5×", ultra: "10×", addons: "5×" },
      { label: "Plus models (10× memory)", premium: "0.1 / msg", ultra: "Unlimited", addons: "0.1 / msg" },
      { label: "Base models", premium: "Unlimited", ultra: "Unlimited", addons: "0.1 / msg" },
      { label: "Image generation", premium: "1 token", ultra: "1 token", addons: "1 token" },
      { label: "Audio message", premium: "3 tokens", ultra: "3 tokens", addons: "3 tokens" },
      { label: "3s video", premium: "5 tokens", ultra: "5 tokens", addons: "5 tokens" },
      { label: "5s video", premium: "10 tokens", ultra: "10 tokens", addons: "10 tokens" },
    ],
  },
  {
    group: "Unlocks",
    rows: [
      { label: "In-Chat videos", premium: true, ultra: true, addons: true },
      { label: "In-Chat images", premium: true, ultra: true, addons: true },
      { label: "2k image resolution", premium: true, ultra: true, addons: true },
      { label: "All image models", premium: true, ultra: true, addons: true },
      { label: "All chat models", premium: true, ultra: true, addons: true },
      { label: "Mods", premium: true, ultra: true, addons: true },
    ],
  },
];

const tokenPacks = [
  { tokens: "100", price: "€9.99", wasPrice: null, save: null, badge: null, bonus: null, images: "100", videos: "20", perToken: "€0.10" },
  { tokens: "200", price: "€17.99", wasPrice: "€19.98", save: "Save 10%", badge: null, bonus: null, images: "200", videos: "40", perToken: "€0.09" },
  { tokens: "500", price: "€39.99", wasPrice: "€49.95", save: "Save 20%", badge: "Popular", bonus: null, images: "500", videos: "100", perToken: "€0.08" },
  { tokens: "1,200", price: "€79.99", wasPrice: "€119.88", save: "Save 33%", badge: "Best value", bonus: "+200 bonus tokens", images: "1,200", videos: "240", perToken: "€0.07" },
];

const tokenPerks = [
  "Create Unlimited AI Babes",
  "Tokens never expire",
  "Generate images for 1 token",
  "Voice messages for 3 tokens",
  "Generate videos for 5 tokens",
  "Create and unlock spicy stories",
];


const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "Go to Profile → Settings → Subscription → Cancel subscription. You'll keep access until the end of your current billing period.",
  },
  {
    q: "Why was my credit card declined?",
    a: "Card payments can be declined for several reasons, including bank restrictions, insufficient funds, or security rules applied to adult or digital services. Contact your bank or try another card.",
  },
  {
    q: "Can I get a refund if I don't like the service?",
    a: "If you experience a technical issue or an error with your purchase, contact our support team. Refunds are handled individually according to our refund policy.",
  },
  {
    q: "Can I use all features if I cancel subscription?",
    a: "Yes. After canceling, you'll keep full access until the end of your billing cycle. After that, your account switches back to the free plan.",
  },
  {
    q: "How do you ensure my data privacy?",
    a: "We comply with GDPR. We don't sell personal data, and conversations and generated content are protected using industry-standard security.",
  },
];

const Cell = ({ value }: { value: string | boolean }) => {
  if (value === true)
    return <Check className="h-4 w-4 text-primary-v2 mx-auto" strokeWidth={2.5} />;
  if (value === false || value === "—")
    return <Minus className="h-4 w-4 text-grey-light-4-v2 mx-auto" />;
  return <span className="text-sm text-foreground-v2">{value}</span>;
};

const Pricing = () => {
  const [tab, setTab] = useState<TabKey>("subscriptions");
  const [billing, setBilling] = useState<BillingKey>("quarterly");
  const [compareCol, setCompareCol] = useState<"premium" | "ultra" | "addons">("ultra");

  // Rotating "just purchased" social proof toasts
  useEffect(() => {
    const activity = [
      { name: "Marco", plan: "Ultra", city: "Berlin" },
      { name: "Aiko", plan: "Premium", city: "Tokyo" },
      { name: "Liam", plan: "500 tokens", city: "London" },
      { name: "Sofia", plan: "Ultra", city: "Madrid" },
      { name: "Noah", plan: "1,200 tokens", city: "Toronto" },
    ];
    let i = 0;
    const fire = () => {
      const a = activity[i % activity.length];
      toast(`${a.name} from ${a.city} just got ${a.plan}`, {
        description: "a few seconds ago",
        position: "bottom-left",
      });
      i++;
    };
    const t1 = setTimeout(fire, 4000);
    const t2 = setInterval(fire, 14000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);



  return (
    <div className="min-h-screen bg-background-v2 text-foreground-v2 font-[var(--font-onest)]">
      {/* Local animation keyframes */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: scale(1.05) translate3d(0,0,0); }
          50% { transform: scale(1.08) translate3d(0,-12px,0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.6; }
        }
        .hero-img { animation: heroFloat 14s ease-in-out infinite; }
        .hero-glow { animation: glowPulse 6s ease-in-out infinite; }
      `}</style>


      {/* Hero with animated image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="AI companion characters"
            className="hero-img w-full h-full object-cover object-top will-change-transform"
          />
          {/* Vignette + bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-background-v2/60 via-background-v2/40 to-background-v2" />
          <div className="absolute inset-0 bg-gradient-to-r from-background-v2/70 via-transparent to-background-v2/70" />
          {/* Blue glow */}
          <div className="hero-glow absolute -bottom-32 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full blur-[120px] bg-primary-v2/40" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 pt-24 pb-32 md:pt-32 md:pb-40 text-center">
          <span className="inline-block text-[11px] tracking-[0.22em] uppercase text-grey-light-3-v2">
            Pricing
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-light tracking-tight leading-[1.05]">
            One subscription.<br />
            <span className="text-primary-v2">Every</span> companion.
          </h1>
          <p className="mt-6 max-w-md mx-auto text-sm md:text-base text-grey-light-3-v2">
            Join thousands of creators building their own AI harem. Cancel anytime, no questions asked.
          </p>

          {/* Social proof: avatars + rating */}
          <div className="mt-7 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex -space-x-2">
              {[
                "linear-gradient(135deg,hsl(348_90%_55%),hsl(20_100%_55%))",
                "linear-gradient(135deg,hsl(213_100%_55%),hsl(260_80%_55%))",
                "linear-gradient(135deg,hsl(45_90%_55%),hsl(20_100%_55%))",
                "linear-gradient(135deg,hsl(180_70%_50%),hsl(213_100%_55%))",
                "linear-gradient(135deg,hsl(320_70%_55%),hsl(280_70%_55%))",
              ].map((bg, i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-background-v2"
                  style={{ background: bg }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-[hsl(45_95%_60%)]" fill="hsl(45 95% 60%)" strokeWidth={0} />
                ))}
              </div>
              <span className="text-xs text-grey-light-3-v2"><span className="font-semibold text-foreground-v2">4.8</span> · 2,300+ reviews</span>
            </div>
          </div>
        </div>
      </section>


      {/* Tabs + Plans */}
      <section className="mx-auto max-w-5xl px-5 -mt-16 relative z-10">
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border border-border-v2/60 bg-background-v2/80 backdrop-blur p-1">
            {(["subscriptions", "addons"] as TabKey[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-5 py-2 text-xs font-medium rounded-full capitalize transition-colors",
                  tab === t
                    ? "bg-foreground-v2 text-background-v2"
                    : "text-grey-light-3-v2 hover:text-foreground-v2"
                )}
              >
                {t === "addons" ? "Add-ons" : "Subscriptions"}
              </button>
            ))}
          </div>
        </div>

        {tab === "subscriptions" ? (
          <>
            {/* Billing toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-v2/60 bg-grey-dark-1-v2/40 p-1">
                {(["monthly", "quarterly"] as BillingKey[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={cn(
                      "px-4 py-1.5 text-xs font-medium rounded-full capitalize transition-colors flex items-center gap-2",
                      billing === b
                        ? "bg-primary-v2 text-primary-v2-foreground"
                        : "text-grey-light-3-v2 hover:text-foreground-v2"
                    )}
                  >
                    {b === "quarterly" ? "3 months" : "Monthly"}
                    {b === "quarterly" && (
                      <span className={cn(
                        "text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded-full",
                        billing === "quarterly"
                          ? "bg-primary-v2-foreground/20 text-primary-v2-foreground"
                          : "bg-primary-v2/15 text-primary-v2"
                      )}>40% OFF</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => {
                const pricing = p[billing];
                return (
                  <article
                    key={p.id}
                    className={cn(
                      "group relative rounded-2xl border p-8 md:p-10 flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                      p.highlight
                        ? "border-primary-v2/50 bg-gradient-to-b from-primary-v2/[0.08] to-transparent shadow-[0_0_40px_-12px_hsl(213_100%_50%/0.4)] hover:shadow-[0_0_60px_-8px_hsl(213_100%_50%/0.6)] hover:border-primary-v2/80"
                        : "border-border-v2/60 bg-grey-dark-1-v2/30 hover:border-foreground-v2/40 hover:bg-grey-dark-1-v2/50"
                    )}
                  >
                    {p.highlight && (
                      <span className="absolute -top-2.5 left-8 text-[10px] font-semibold tracking-[0.18em] uppercase bg-primary-v2 text-primary-v2-foreground px-2.5 py-1 rounded-full shadow-lg shadow-primary-v2/30">
                        Most popular
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold">{p.name}</h2>
                      {pricing.saveLabel && (
                        <span className={cn(
                          "text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full whitespace-nowrap",
                          p.highlight
                            ? "bg-primary-v2/20 text-primary-v2"
                            : "bg-accent-yellow-v2/15 text-accent-yellow-v2"
                        )}>
                          {pricing.saveLabel}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-grey-light-4-v2 max-w-xs">{p.tagline}</p>

                    <div className="mt-8 flex items-baseline gap-2 flex-wrap">
                      <span className="text-5xl font-light tracking-tight">{pricing.price}</span>
                      <span className="text-sm text-grey-light-4-v2">/mo</span>
                      {pricing.originalPrice && (
                        <span className="text-base text-grey-light-4-v2 line-through ml-1">{pricing.originalPrice}</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-grey-light-4-v2">{pricing.note}</p>

                    <button
                      className={cn(
                        "mt-7 group/btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all",
                        p.highlight
                          ? "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-light-v2 shadow-lg shadow-primary-v2/30 hover:shadow-xl hover:shadow-primary-v2/50 hover:scale-[1.02]"
                          : "bg-foreground-v2 text-background-v2 hover:opacity-90 hover:scale-[1.02]"
                      )}
                    >
                      {p.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </button>

                    <p className="mt-3 text-center text-[11px] text-grey-light-4-v2">
                      {p.socialProof} · Cancel anytime
                    </p>

                    <ul className="mt-6 space-y-3 pt-6 border-t border-border-v2/40">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm text-grey-light-2-v2">
                          <Check
                            className={cn(
                              "h-4 w-4 mt-0.5 shrink-0",
                              p.highlight ? "text-primary-v2" : "text-grey-light-3-v2"
                            )}
                            strokeWidth={2.5}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <div className="text-center mb-10 max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">Get tokens</h2>
              <p className="mt-3 text-sm text-grey-light-4-v2">
                Buy tokens as a one-off purchase. No commitment, no expiration date.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {tokenPacks.map((t) => {
                const isBest = t.badge === "Best value";
                const isPopular = t.badge === "Popular";
                const isFeatured = isBest || isPopular;
                return (
                  <button
                    key={t.tokens}
                    type="button"
                    className={cn(
                      "group relative text-left rounded-2xl border p-6 flex flex-col transition-all duration-300 cursor-pointer hover:-translate-y-1",
                      isBest
                        ? "border-primary-v2/60 bg-gradient-to-b from-primary-v2/[0.10] to-transparent shadow-[0_0_40px_-12px_hsl(213_100%_50%/0.5)] hover:shadow-[0_0_60px_-8px_hsl(213_100%_50%/0.7)] hover:border-primary-v2"
                        : "border-border-v2/60 bg-grey-dark-1-v2/30 hover:border-primary-v2/40 hover:bg-grey-dark-1-v2/50 hover:shadow-[0_0_30px_-10px_hsl(213_100%_50%/0.3)]"
                    )}
                  >
                    {t.badge && (
                      <span className={cn(
                        "absolute -top-2.5 left-6 text-[10px] font-semibold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full shadow-lg",
                        isBest
                          ? "bg-primary-v2 text-primary-v2-foreground shadow-primary-v2/40"
                          : "bg-foreground-v2 text-background-v2"
                      )}>
                        {t.badge}
                      </span>
                    )}

                    {/* Header: icon + savings badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(348_90%_55%/0.35)] to-[hsl(330_85%_45%/0.1)] border border-[hsl(348_90%_60%/0.55)] shadow-[0_0_22px_-4px_hsl(348_90%_55%/0.7)]">
                        <Flame className="h-5 w-5 text-[hsl(350_95%_65%)]" strokeWidth={2.5} fill="hsl(350 95% 60% / 0.3)" />
                      </div>
                      {t.save && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full bg-[hsl(0_85%_60%/0.15)] text-[hsl(0_90%_70%)] border border-[hsl(0_85%_60%/0.3)]">
                          {t.save}
                        </span>
                      )}
                    </div>

                    {/* Tokens */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-light tracking-tight">{t.tokens}</span>
                      <span className="text-xs text-grey-light-4-v2">tokens</span>
                    </div>
                    {t.bonus && (
                      <span className="mt-1 text-[11px] font-medium text-primary-v2">{t.bonus}</span>
                    )}

                    {/* What you can generate */}
                    <div className="mt-5 space-y-2 pt-4 border-t border-border-v2/40">
                      <div className="flex items-center gap-2 text-[12px] text-grey-light-2-v2">
                        <ImageIcon className="h-3.5 w-3.5 text-grey-light-3-v2 shrink-0" strokeWidth={2} />
                        <span><span className="font-semibold text-foreground-v2">{t.images}</span> images</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-grey-light-2-v2">
                        <Video className="h-3.5 w-3.5 text-grey-light-3-v2 shrink-0" strokeWidth={2} />
                        <span><span className="font-semibold text-foreground-v2">{t.videos}</span> videos</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-3xl font-light tracking-tight">{t.price}</span>
                        {t.wasPrice && (
                          <span className="text-sm text-grey-light-4-v2 line-through">{t.wasPrice}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-grey-light-4-v2 mt-0.5">
                        {t.perToken} per token · one-time
                      </div>
                      <div className={cn(
                        "mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition-all group-hover:scale-[1.02]",
                        isFeatured
                          ? "bg-primary-v2 text-primary-v2-foreground group-hover:bg-primary-light-v2 shadow-lg shadow-primary-v2/30"
                          : "bg-foreground-v2 text-background-v2 group-hover:opacity-90"
                      )}>
                        Buy Tokens
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* What you get */}
            <div className="mt-12 rounded-2xl border border-border-v2/60 bg-grey-dark-1-v2/30 p-8">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-grey-light-3-v2">What you get</h3>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {tokenPerks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-grey-light-2-v2">
                    <Check className="h-4 w-4 text-primary-v2 shrink-0" strokeWidth={2.5} />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>


      {/* Compare */}
      <section className="mx-auto max-w-5xl px-5 pt-28 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] tracking-[0.22em] uppercase text-grey-light-4-v2">
              Compare
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight">
              Features, side by side.
            </h2>
          </div>
          <div className="inline-flex rounded-full border border-border-v2/60 p-1 self-start md:self-auto md:hidden">
            {(["premium", "ultra", "addons"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCompareCol(c)}
                className={cn(
                  "px-4 py-1.5 text-xs font-medium rounded-full capitalize transition-colors",
                  compareCol === c
                    ? "bg-foreground-v2 text-background-v2"
                    : "text-grey-light-3-v2"
                )}
              >
                {c === "addons" ? "Add-ons" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] px-6 py-4 text-[11px] tracking-[0.18em] uppercase text-grey-light-4-v2 border-b border-border-v2/60">
            <div>Feature</div>
            <div className="text-center">Premium</div>
            <div className="text-center text-primary-v2">Ultra</div>
            <div className="text-center">Add-ons</div>
          </div>
          {compareRows.map((g) => (
            <div key={g.group}>
              <div className="px-6 pt-8 pb-3 text-xs font-medium text-grey-light-3-v2">
                {g.group}
              </div>
              {g.rows.map((r) => (
                <div
                  key={r.label}
                  className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center px-6 py-3.5 border-t border-border-v2/30"
                >
                  <div className="text-sm text-grey-light-2-v2">{r.label}</div>
                  <div className="text-center"><Cell value={r.premium} /></div>
                  <div className="text-center"><Cell value={r.ultra} /></div>
                  <div className="text-center"><Cell value={r.addons} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {compareRows.map((g) => (
            <div key={g.group} className="mb-6">
              <div className="px-1 py-2 text-xs font-medium text-grey-light-3-v2">
                {g.group}
              </div>
              {g.rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-1 py-3 border-t border-border-v2/30">
                  <span className="text-sm text-grey-light-2-v2 pr-4">{r.label}</span>
                  <Cell value={r[compareCol]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <span className="text-[11px] tracking-[0.22em] uppercase text-grey-light-4-v2">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-light tracking-tight sticky top-24">
              Questions,<br />answered.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="border-b border-border-v2/40"
                >
                  <AccordionTrigger className="py-5 text-left text-sm md:text-base font-medium hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-grey-light-4-v2 leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border-v2/40">
        <div className="mx-auto max-w-5xl px-5 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-light tracking-tight">
              Still have a question?
            </h3>
            <p className="mt-2 text-sm text-grey-light-4-v2 max-w-md">
              Contact our support team or join our Discord community.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground-v2 text-background-v2 px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
              Contact support
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border-v2 px-5 py-2.5 text-sm font-medium hover:border-primary-v2 hover:text-primary-v2 transition-colors">
              Join Discord
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
