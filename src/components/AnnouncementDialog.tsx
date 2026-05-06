import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Announcement } from "@/components/NotificationsSidebar";

interface AnnouncementDialogProps {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnouncementDialog = ({ announcement, open, onOpenChange }: AnnouncementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[120] flex h-[100dvh] w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-card p-0 text-foreground sm:h-auto sm:max-h-[85vh] sm:w-[calc(100%-32px)] sm:max-w-[560px] sm:rounded-2xl sm:border sm:border-border/60">
        {announcement && (
          <div className="scrollbar-themed flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-primary">{announcement.tag}</span>
                <span className="text-muted-foreground">{announcement.date}</span>
              </div>
              <DialogTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-[28px]">
                {announcement.headline}
              </DialogTitle>
              <DialogDescription className="text-[15px] leading-relaxed text-muted-foreground">
                {announcement.intro}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-7">
              {announcement.sections.map((section, idx) => (
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

            {announcement.cta && (
              <a
                href={announcement.cta.url}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {announcement.cta.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}

            {announcement.outro && (
              <p className="mt-6 border-t border-border/40 pt-5 text-sm leading-relaxed text-muted-foreground">
                {announcement.outro}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
