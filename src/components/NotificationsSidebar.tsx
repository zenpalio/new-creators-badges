import { useState } from "react";
import { CheckCheck, X } from "lucide-react";
import AnnouncementDialog from "./AnnouncementDialog";

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
  unread?: boolean;
};

interface NotificationsSidebarProps {
  open: boolean;
  onClose: () => void;
  onReopen?: () => void;
  notifications: Notification[];
  announcements: Announcement[];
}

const NotificationsSidebar = ({ open, onClose, onReopen, notifications, announcements }: NotificationsSidebarProps) => {
  const [tab, setTab] = useState<"notifications" | "whats-new">("notifications");
  const [openAnnouncement, setOpenAnnouncement] = useState<Announcement | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const unreadCount = notifications.filter((n) => n.unread && !readIds.has(n.id)).length;
  const markAllRead = () => setReadIds(new Set(notifications.map((n) => n.id)));

  return (
    <>
      <div
        className={`fixed inset-0 z-[100] transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <aside
          className={`absolute right-0 top-0 flex h-full max-h-[100dvh] w-full flex-col bg-card-v2 shadow-2xl transition-transform duration-300 sm:max-w-[380px] [padding-top:env(safe-area-inset-top)] [padding-bottom:env(safe-area-inset-bottom)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <h2 className="text-base font-bold text-foreground-v2">
              {tab === "notifications" ? "Notifications" : "What's new"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-v2-foreground hover:bg-muted-v2 hover:text-foreground-v2"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* System status indicators */}
          <div className="border-y border-border-v2/40">
            <div className="flex items-center gap-2 px-5 py-2.5 text-xs text-muted-v2-foreground">
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: "hsl(var(--success-v2))" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--success-v2))" }}
                />
              </span>
              <span>All systems operational</span>
            </div>
            <div className="flex items-start gap-2 border-t border-border-v2/40 px-5 py-2.5 text-xs text-muted-v2-foreground">
              <span className="relative mt-1 flex h-2 w-2 shrink-0">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                  style={{ backgroundColor: "hsl(var(--warning-v2))" }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--warning-v2))" }}
                />
              </span>
              <span className="leading-snug">
                We are performing database maintenance. Site will be down for ~10 mins. Thanks for your patience — we'll be back up shortly!
              </span>
            </div>
          </div>

          {/* Top action row — only when there are unread notifications */}
          {tab === "notifications" && unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center justify-center gap-2 border-b border-border-v2/40 py-2.5 text-xs font-medium text-foreground-v2/90 transition-colors hover:bg-muted-v2/40"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read ({unreadCount})
            </button>
          )}

          {/* Body */}
          <div className="scrollbar-themed flex-1 overflow-y-auto">
            {tab === "notifications" ? (
              <ul className="flex flex-col">
                {notifications.map((n) => {
                  const isUnread = n.unread && !readIds.has(n.id);
                  return (
                    <li
                      key={n.id}
                      className={`relative flex items-center gap-3 border-b border-border-v2/30 px-5 py-3 transition-colors hover:bg-muted-v2/30 ${
                        isUnread ? "bg-primary-v2/5" : ""
                      }`}
                    >
                      {isUnread && (
                        <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-v2" />
                      )}
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted-v2">
                        {n.avatar ? (
                          <img src={n.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-muted-v2-foreground">
                            {n.initials}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-xs leading-snug text-foreground-v2/90">
                        <span className="font-semibold text-foreground-v2">{n.actor}</span>{" "}
                        <span className="text-muted-v2-foreground">{n.action}</span>
                        {n.target && <span className="font-semibold text-foreground-v2"> {n.target}</span>}
                      </div>
                      {n.thumbnail && (
                        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted-v2">
                          <img src={n.thumbnail} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="flex flex-col">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => {
                        setOpenAnnouncement(a);
                        onClose();
                      }}
                      className="flex w-full flex-col gap-1 border-b border-border-v2/30 px-5 py-3.5 text-left transition-colors hover:bg-muted-v2/30"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-medium">
                        <span className="rounded-full bg-primary-v2/15 px-2 py-0.5 text-primary-v2">{a.tag}</span>
                        <span className="text-muted-v2-foreground">{a.date}</span>
                      </div>
                      <h3 className="text-xs font-semibold leading-snug text-foreground-v2">{a.title}</h3>
                      <p className="line-clamp-2 text-[11px] leading-snug text-muted-v2-foreground">{a.description}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom tab switcher */}
          <div className="grid grid-cols-2 gap-2 border-t border-border-v2/40 p-2.5">
            <button
              onClick={() => setTab("notifications")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === "notifications"
                  ? "bg-muted-v2 text-foreground-v2"
                  : "text-muted-v2-foreground hover:bg-muted-v2/50 hover:text-foreground-v2"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setTab("whats-new")}
              className={`relative rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                tab === "whats-new"
                  ? "bg-muted-v2 text-foreground-v2"
                  : "text-muted-v2-foreground hover:bg-muted-v2/50 hover:text-foreground-v2"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                What's new?
                {announcements.length > 0 && tab !== "whats-new" && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-v2 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-v2" />
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Discord link */}
          <a
            href="https://discord.gg/lovable-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border-t border-border-v2/40 px-5 py-2.5 text-xs font-medium text-muted-v2-foreground transition-colors hover:bg-muted-v2/40 hover:text-foreground-v2"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3a14.61 14.61 0 0 0-.617 1.265 18.27 18.27 0 0 0-5.487 0A14.61 14.61 0 0 0 9.837 3 19.79 19.79 0 0 0 6.077 4.369C2.61 9.534 1.67 14.568 2.14 19.527A19.94 19.94 0 0 0 8.18 22.5a14.66 14.66 0 0 0 1.262-2.05 12.85 12.85 0 0 1-1.987-.95c.166-.122.33-.25.487-.38a14.18 14.18 0 0 0 12.116 0c.158.13.32.258.487.38-.633.376-1.302.696-1.99.951.376.726.797 1.41 1.262 2.05a19.93 19.93 0 0 0 6.041-2.973c.55-5.748-.94-10.737-3.541-15.158ZM8.52 16.402c-1.182 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.333-.955 2.418-2.157 2.418Zm6.96 0c-1.183 0-2.158-1.085-2.158-2.418 0-1.333.955-2.418 2.158-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.333-.946 2.418-2.157 2.418Z" />
            </svg>
            Join our Discord
          </a>
        </aside>
      </div>

      <AnnouncementDialog
        announcement={openAnnouncement}
        open={!!openAnnouncement}
        onOpenChange={(o) => {
          if (!o) {
            setOpenAnnouncement(null);
            onReopen?.();
          }
        }}
      />
    </>
  );
};

export default NotificationsSidebar;
