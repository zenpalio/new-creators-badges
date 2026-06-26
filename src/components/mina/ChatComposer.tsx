import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string; }

const ChatComposer = ({ onAfterReply }: { onAfterReply?: () => void }) => {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // Load recent history
  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: comp } = await supabase.from("companions").select("id").eq("slug", "mina").maybeSingle();
      if (!comp) return;
      const { data } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("user_id", u.user.id)
        .eq("companion_id", comp.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setMsgs(data.reverse() as Msg[]);
    })();
  }, []);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = text.trim();
    if (!m || sending) return;
    setText("");
    setMsgs((p) => [...p, { role: "user", content: m }]);
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("mina-chat", { body: { slug: "mina", message: m } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setMsgs((p) => [...p, { role: "assistant", content: data.reply }]);
      onAfterReply?.();
    } catch (err: any) {
      toast.error(err.message ?? "Mina is silent…");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-hide">
        {msgs.length === 0 && (
          <div className="text-center text-xs text-muted-v2-foreground/70 py-8">
            Say something to Mina…
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
              m.role === "user"
                ? "bg-primary-v2 text-primary-v2-foreground rounded-br-sm"
                : "bg-background-v2/80 backdrop-blur-md text-foreground-v2 border border-border-v2/40 rounded-bl-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-background-v2/80 backdrop-blur-md border border-border-v2/40 rounded-2xl rounded-bl-sm px-3 py-2">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 p-2 border-t border-border-v2/40 bg-background-v2/60 backdrop-blur-md">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message Mina…"
          className="flex-1 bg-muted-v2/60 rounded-full px-4 py-2 text-sm text-foreground-v2 placeholder:text-muted-v2-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatComposer;
