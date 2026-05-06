import { useState } from "react";
import { CheckCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AnnouncementSection = {
  emoji: string;
  title: string;
  items: { name: string; description: string }[];
};

export type Announcement = {
  id: string;
  tag: string;
  date: string;
  title: string;
  description: string;
  headline: string;
  intro: string;
  sections: AnnouncementSection[];
  cta?: { label: string; url: string };
  outro?: string;
};

export type Notification = {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target?: string;
  thumbnail?: string;
  avatar?: string;
  read?: boolean;
};

interface NotificationsSidebarProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  announcements: Announcement[];
}

const NotificationsSidebar = ({ open, onClose, notifications, announcements }: NotificationsSidebarProps) => {
  const [tab, setTab] = useState<"notifications" | "whats-new">("notifications");
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement | null>(null);

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-[380px] flex-col bg-card shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <h2 className="text-base font-bold text-foreground">
              {tab === "notifications" ? "Notifications" : "What's new"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* System status indicator */}
          <div className="flex items-center gap-2 border-y border-border/40 px-5 py-2.5 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
            </span>
            <span>All systems operational</span>
          </div>

          {/* Top action row (only for notifications) */}
          {tab === "notifications" && (
            <button className="flex items-center justify-center gap-2 border-b border-border/40 py-2.5 text-xs font-medium text-foreground/90 transition-colors hover:bg-muted/40">
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </button>
          )}

          {/* Body */}
          <div className="scrollbar-themed flex-1 overflow-y-auto">
            {tab === "notifications" ? (
              <ul className="flex flex-col">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-3 border-b border-border/30 px-5 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
                      {n.avatar ? (
                        <img src={n.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-muted-foreground">
                          {n.initials}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1 text-xs leading-snug text-foreground/90">
                      <span className="font-semibold text-foreground">{n.actor}</span>{" "}
                      <span className="text-muted-foreground">{n.action}</span>
                      {n.target && <span className="font-semibold text-foreground"> {n.target}</span>}
                    </div>
                    {n.thumbnail && (
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
                        <img src={n.thumbnail} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-col">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => setOpenAnnouncement(a)}
                      className="flex w-full flex-col gap-1 border-b border-border/30 px-5 py-3.5 text-left transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-medium">
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{a.tag}</span>
                        <span className="text-muted-foreground">{a.date}</span>
                      </div>
                      <h3 className="text-xs font-semibold leading-snug text-foreground">{a.title}</h3>
                      <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{a.description}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom tab switcher */}
          <div className="grid grid-cols-2 gap-2 border-t border-border/40 p-2.5">
            <button
              onClick={() => setTab("notifications")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === "notifications"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setTab("whats-new")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === "whats-new"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              What's new?
            </button>
          </div>

          {/* Discord link */}
          <a
            href="https://discord.gg/lovable-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-border/40 px-5 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.61 14.61 0 0 0-.617 1.265 18.27 18.27 0 0 0-5.487 0A14.61 14.61 0 0 0 9.837 3 19.79 19.79 0 0 0 6.077 4.369C2.61 9.534 1.67 14.568 2.14 19.527A19.94 19.94 0 0 0 8.18 22.5a14.66 14.66 0 0 0 1.262-2.05 12.85 12.85 0 0 1-1.987-.95c.166-.122.33-.25.487-.38a14.18 14.18 0 0 0 12.116 0c.158.13.32.258.487.38-.633.376-1.302.696-1.99.951.376.726.797 1.41 1.262 2.05a19.93 19.93 0 0 0 6.041-2.973c.55-5.748-.94-10.737-3.541-15.158ZM8.52 16.402c-1.182 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.333-.955 2.418-2.157 2.418Zm6.96 0c-1.183 0-2.158-1.085-2.158-2.418 0-1.333.955-2.418 2.158-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.333-.946 2.418-2.157 2.418Z" />
            </svg>
            Join our Discord
          </a>
        </aside>
      </div>

      {/* Announcement detail dialog */}
      <Dialog open={!!openAnnouncement} onOpenChange={(o) => !o && setOpenAnnouncement(null)}>
        <DialogContent className="z-[120] w-[calc(100%-32px)] max-w-[560px] gap-0 rounded-2xl border-border/60 bg-card p-0 text-foreground">
          {openAnnouncement && (
            <div className="scrollbar-themed max-h-[80vh] overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
              <DialogHeader className="space-y-3 text-left">
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">
                    {openAnnouncement.tag}
                  </span>
                  <span className="text-muted-foreground">{openAnnouncement.date}</span>
                </div>
                <DialogTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]">
                  {openAnnouncement.headline}
                </DialogTitle>
                <DialogDescription className="text-[15px] leading-relaxed text-muted-foreground">
                  {openAnnouncement.intro}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-7">
                {openAnnouncement.sections.map((section, idx) => (
                  <section key={section.title}>
                    <h3 className="flex items-baseline gap-2 text-base font-bold uppercase tracking-wide text-foreground">
                      <span aria-hidden className="text-lg leading-none">
                        {section.emoji}
                      </span>
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{section.title}</span>
                    </h3>
                    <ul className="mt-3 space-y-2.5">
                      {section.items.map((item) => (
                        <li
                          key={item.name}
                          className="rounded-xl border border-border/40 bg-background/40 p-3 text-sm leading-snug text-muted-foreground"
                        >
                          <span className="font-semibold text-foreground">{item.name}:</span>{" "}
                          {item.description}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {openAnnouncement.cta && (
                <a
                  href={openAnnouncement.cta.url}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {openAnnouncement.cta.label}
                </a>
              )}

              {openAnnouncement.outro && (
                <p className="mt-6 border-t border-border/40 pt-5 text-sm leading-relaxed text-muted-foreground">
                  {openAnnouncement.outro}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsSidebar;
