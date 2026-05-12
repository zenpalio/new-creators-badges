import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { Announcement } from "./NotificationsSidebar";

interface AnnouncementDialogProps {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnnouncementDialog = ({ announcement, open, onOpenChange }: AnnouncementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[120] flex h-[100dvh] w-screen max-w-none flex-col gap-0 rounded-none border-0 bg-card-v2 p-0 text-foreground-v2 left-0 top-0 translate-x-0 translate-y-0 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-0 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-left-0 data-[state=open]:slide-in-from-top-0 sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-[calc(100%-32px)] sm:max-w-[560px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:border sm:border-border-v2/60">
        {announcement && (
          <div className="scrollbar-themed flex-1 overflow-y-auto px-5 pb-6 pt-5 sm:px-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span className="rounded-full bg-primary-v2/15 px-2 py-0.5 text-primary-v2">{announcement.tag}</span>
                <span className="text-muted-v2-foreground">{announcement.date}</span>
              </div>
              <DialogTitle className="text-2xl font-extrabold leading-tight tracking-tight text-foreground-v2 sm:text-[28px]">
                {announcement.headline}
              </DialogTitle>
              <DialogDescription className="text-[15px] leading-relaxed text-muted-v2-foreground">
                {announcement.intro}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-7">
              {announcement.sections.map((section, idx) => (
                <section key={section.title}>
                  <h3 className="flex items-baseline gap-2 text-base font-bold uppercase tracking-wide text-foreground-v2">
                    <span aria-hidden className="text-lg leading-none">
                      {section.emoji}
                    </span>
                    <span className="text-muted-v2-foreground">{idx + 1}.</span>
                    <span>{section.title}</span>
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {section.items.map((item) => (
                      <li
                        key={item.name}
                        className="rounded-xl border border-border-v2/40 bg-background-v2/40 p-3 text-sm leading-snug text-muted-v2-foreground"
                      >
                        <span className="font-semibold text-foreground-v2">{item.name}:</span>{" "}
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
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-v2 px-5 py-3 text-sm font-semibold text-primary-v2-foreground transition-opacity hover:opacity-90"
              >
                {announcement.cta.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}

            {announcement.outro && (
              <p className="mt-6 border-t border-border-v2/40 pt-5 text-sm leading-relaxed text-muted-v2-foreground">
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
