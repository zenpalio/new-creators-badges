import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Minus, ChevronDown, ArrowUpRight, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type TabKey = "subscriptions" | "addons";

const plans = [
  {
    id: "premium",
    name: "Premium",
    tagline: "Deeper interactions, faster generation, priority access.",
    price: "€14.99",
    cadence: "/month",
    note: "Billed monthly · Money-back guarantee",
    badge: "QUARTERLY · 40% OFF",
    cta: "Go Premium",
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
    price: "€29.99",
    cadence: "/month",
    note: "Billed monthly · +400 token bonus",
    badge: "MOST POWERFUL",
    cta: "Go Ultra",
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
      { label: "Messages on Plus models (10× memory)", premium: "0.1 / msg", ultra: "Unlimited", addons: "0.1 / msg" },
      { label: "Messages on base models", premium: "Unlimited", ultra: "Unlimited", addons: "0.1 / msg" },
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
      { label: "All image models unlocked", premium: true, ultra: true, addons: true },
      { label: "All chat models unlocked", premium: true, ultra: true, addons: true },
      { label: "Mods", premium: true, ultra: true, addons: true },
    ],
  },
];

const addons = [
  { name: "Token Pack 100", price: "€4.99", desc: "One-time top-up. Never expires." },
  { name: "Token Pack 500", price: "€19.99", desc: "Best for occasional creators. +5% bonus." },
  { name: "Token Pack 1500", price: "€49.99", desc: "Power pack. +15% bonus tokens." },
  { name: "Gift Card", price: "from €10", desc: "Send tokens to a friend. Redeemable anytime." },
];

const faqs = [
  {
    q: "How do I cancel my subscription?",
    a: "Go to Profile → Settings → Subscription → Cancel subscription. Fill out the short cancellation form and you'll keep access until the end of your current billing period.",
  },
  {
    q: "Why was my credit card declined?",
    a: "Card payments can be declined for several reasons, including bank restrictions, insufficient funds, or security rules applied to adult or digital services. Contact your bank or try another card.",
  },
  {
    q: "Can I get a refund if I don't like the service?",
    a: "If you experience a technical issue or an error with your purchase, contact our support team. Refunds are handled individually according to our refund policy and payment provider rules.",
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
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-v2/15 text-primary-v2">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    );
  if (value === false || value === "—")
    return <Minus className="h-4 w-4 text-grey-light-4-v2" />;
  return <span className="text-sm font-medium text-foreground-v2">{value}</span>;
};

const Pricing = () => {
  const [tab, setTab] = useState<TabKey>("subscriptions");
  const [compareCol, setCompareCol] = useState<"premium" | "ultra" | "addons">("ultra");

  return (
    <div className="min-h-screen bg-background-v2 text-foreground-v2 font-[var(--font-onest)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border-v2/40 bg-background-v2/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-base font-extrabold tracking-tight">
            mybabes<span className="text-primary-v2">.ai</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-grey-light-3-v2 hover:text-foreground-v2 transition-colors"
          >
            ← Back to app
          </Link>
        </div>
      </header>

      {/* Hero — editorial */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border-v2 px-3 py-1 text-[11px] tracking-[0.18em] text-grey-light-3-v2 uppercase">
              <Sparkles className="h-3 w-3 text-primary-v2" />
              AI Companion App of 2025
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight">
              Pricing,
              <br />
              <span className="text-grey-light-4-v2 italic font-light">built for </span>
              <span className="text-primary-v2">creators.</span>
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:pb-4">
            <p className="text-sm md:text-base text-grey-light-3-v2 max-w-sm">
              Join thousands of creators building their own AI harem. Cancel anytime,
              keep access until the end of your billing cycle.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex items-center gap-1 border-b border-border-v2/60">
          {(["subscriptions", "addons"] as TabKey[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-5 py-3 text-sm font-medium capitalize transition-colors",
                tab === t ? "text-foreground-v2" : "text-grey-light-4-v2 hover:text-grey-light-2-v2"
              )}
            >
              {t === "addons" ? "Add-ons" : "Subscriptions"}
              {tab === t && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary-v2" />
              )}
            </button>
          ))}
          <span className="ml-auto hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-grey-light-4-v2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-v2 animate-pulse" />
            Quarterly billing · 40% off
          </span>
        </div>
      </section>

      {/* Plans / Add-ons */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        {tab === "subscriptions" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-v2/60 border border-border-v2/60 rounded-2xl overflow-hidden">
            {plans.map((p, idx) => (
              <article
                key={p.id}
                className={cn(
                  "relative bg-background-v2 p-8 md:p-10 flex flex-col",
                  idx === 1 && "bg-grey-dark-1-v2"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] tracking-[0.22em] uppercase text-primary-v2 font-bold">
                      {p.badge}
                    </div>
                    <h2 className="mt-3 text-4xl md:text-5xl font-black">{p.name}</h2>
                  </div>
                  <div className="text-right text-[10px] tracking-[0.18em] uppercase text-grey-light-4-v2">
                    Plan 0{idx + 1}
                  </div>
                </div>

                <p className="mt-4 text-sm text-grey-light-3-v2 max-w-xs">{p.tagline}</p>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black tracking-tight">{p.price}</span>
                  <span className="text-sm text-grey-light-4-v2">{p.cadence}</span>
                </div>
                <p className="mt-1 text-xs text-grey-light-4-v2">{p.note}</p>

                <button
                  className={cn(
                    "mt-8 group inline-flex items-center justify-between gap-3 rounded-full px-6 py-4 text-sm font-bold transition-colors",
                    idx === 1
                      ? "bg-primary-v2 text-primary-v2-foreground hover:bg-primary-light-v2"
                      : "bg-foreground-v2 text-background-v2 hover:bg-grey-light-1-v2"
                  )}
                >
                  {p.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>

                <ul className="mt-10 space-y-3 border-t border-border-v2/60 pt-6">
                  {p.features.map((f, i) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-grey-light-2-v2">
                      <span className="mt-1 w-4 text-[10px] font-mono text-grey-light-4-v2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((a) => (
              <div
                key={a.name}
                className="group rounded-2xl border border-border-v2/60 bg-grey-dark-1-v2 p-6 hover:border-primary-v2/50 transition-colors flex flex-col"
              >
                <h3 className="text-lg font-bold">{a.name}</h3>
                <p className="mt-2 text-xs text-grey-light-4-v2 flex-1">{a.desc}</p>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-2xl font-black">{a.price}</span>
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-v2 text-primary-v2-foreground hover:bg-primary-light-v2 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Compare */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-xl">
            Compare features<span className="text-primary-v2">.</span>
          </h2>
          <div className="inline-flex rounded-full border border-border-v2 p-1 self-start md:self-auto">
            {(["premium", "ultra", "addons"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCompareCol(c)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-full capitalize transition-colors",
                  compareCol === c
                    ? "bg-primary-v2 text-primary-v2-foreground"
                    : "text-grey-light-3-v2 hover:text-foreground-v2"
                )}
              >
                {c === "addons" ? "Add-ons" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-2xl border border-border-v2/60 overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-grey-dark-1-v2 px-6 py-4 text-[10px] tracking-[0.18em] uppercase text-grey-light-4-v2 border-b border-border-v2/60">
            <div>Feature</div>
            <div className="text-center">Premium</div>
            <div className="text-center text-primary-v2">Ultra</div>
            <div className="text-center">Add-ons</div>
          </div>
          {compareRows.map((g) => (
            <div key={g.group}>
              <div className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-grey-light-2-v2 bg-background-v2 border-b border-border-v2/40">
                {g.group}
              </div>
              {g.rows.map((r) => (
                <div
                  key={r.label}
                  className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-border-v2/30 last:border-0 hover:bg-grey-dark-1-v2/40 transition-colors"
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

        {/* Mobile single-column */}
        <div className="md:hidden rounded-2xl border border-border-v2/60 overflow-hidden">
          {compareRows.map((g) => (
            <div key={g.group}>
              <div className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-grey-light-2-v2 bg-grey-dark-1-v2">
                {g.group}
              </div>
              {g.rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between px-5 py-3 border-b border-border-v2/30 last:border-0">
                  <span className="text-sm text-grey-light-2-v2 pr-4">{r.label}</span>
                  <Cell value={r[compareCol]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight sticky top-24">
              Questions,
              <br />
              <span className="text-grey-light-4-v2 italic font-light">answered.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="border-b border-border-v2/60"
                >
                  <AccordionTrigger className="py-6 text-left text-base md:text-lg font-semibold hover:no-underline hover:text-primary-v2 [&[data-state=open]]:text-primary-v2">
                    <span className="flex items-baseline gap-4">
                      <span className="text-[10px] font-mono text-grey-light-4-v2">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-grey-light-3-v2 leading-relaxed pl-10 pb-6">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border-v2/60">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">
              Still have a question?
            </h3>
            <p className="mt-2 text-sm text-grey-light-3-v2 max-w-md">
              Contact our support team or join our Discord community for more information.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-foreground-v2 text-background-v2 px-6 py-3 text-sm font-bold hover:bg-grey-light-1-v2 transition-colors">
              Contact support <ArrowUpRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border-v2 px-6 py-3 text-sm font-bold hover:border-primary-v2 hover:text-primary-v2 transition-colors">
              Join Discord
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
