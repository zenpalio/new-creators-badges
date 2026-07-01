import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SagaSignupModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/saga` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    try {
      const r = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/saga`,
      });
      if (r.error) {
        toast.error("Google sign-in failed");
        return;
      }
      if (r.redirected) return; // browser is navigating away
      // Popup flow: session is set — proceed
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-end sm:items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Sheet */}
      <div
        className="relative w-full sm:max-w-[380px] mx-0 sm:mx-4 bg-background border-t sm:border border-primary-v2/20 sm:rounded-2xl rounded-t-3xl p-6 pb-[max(24px,env(safe-area-inset-bottom))] shadow-[0_-20px_80px_-20px_hsl(var(--primary-v2)/0.4)]"
        style={{ animation: "saga-signup-in 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        <style>{`
          @keyframes saga-signup-in {
            from { transform: translateY(24px); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
        `}</style>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-foreground-v2/50 hover:text-foreground-v2 hover:bg-white/5 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary-v2/30 bg-primary-v2/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-v2 animate-pulse" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-primary-v2 font-medium">
              Chapter One · Locked
            </span>
          </div>
          <h3
            className="text-foreground-v2 font-bold leading-[0.95] tracking-tight mb-2"
            style={{ fontSize: "clamp(24px, 7vw, 30px)" }}
          >
            {mode === "signup" ? "Save your story" : "Welcome back"}
          </h3>
          <p className="text-[12px] text-foreground-v2/60 leading-relaxed max-w-[280px] mx-auto">
            {mode === "signup"
              ? "Create a free account to unlock Chapter One and keep your progress across devices."
              : "Sign in to pick up where you left off."}
          </p>
        </div>

        {/* Google */}
        <button
          onClick={google}
          className="w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center gap-2 text-[13px] font-medium text-foreground-v2 transition mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="relative my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-2 text-[10px] uppercase tracking-[0.3em] text-foreground-v2/40">or</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={submit} className="space-y-2.5">
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 bg-white/[0.04] border-white/10 text-foreground-v2 placeholder:text-foreground-v2/30"
          />
          <Input
            type="password"
            placeholder="password (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-11 bg-white/[0.04] border-white/10 text-foreground-v2 placeholder:text-foreground-v2/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="group w-full h-11 rounded-xl bg-primary-v2 text-primary-v2-foreground text-[12px] font-semibold uppercase tracking-[0.2em] hover:bg-primary-v2/90 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_10px_30px_-10px_hsl(var(--primary-v2)/0.6)]"
          >
            {loading ? "…" : mode === "signup" ? "Continue to Chapter One" : "Sign in"}
            {!loading && <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="w-full text-center text-[11px] text-foreground-v2/50 hover:text-foreground-v2 mt-4 transition"
        >
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create account"}
        </button>

        <p className="text-center text-[9px] uppercase tracking-[0.25em] text-foreground-v2/30 mt-4">
          18+ only · By continuing you confirm you're an adult
        </p>
      </div>
    </div>
  );
}
