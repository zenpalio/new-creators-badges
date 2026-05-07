import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, Menu } from "lucide-react";
import CinematicHero, { type HeroSlide } from "./explore/CinematicHero";
import FloatingToolsFAB from "./explore/FloatingToolsFAB";
import SystemStatusIndicator from "./explore/SystemStatusIndicator";

export interface ExploreViewProps {
  heroSlides: HeroSlide[];
  onMenu: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
  menuAriaLabel?: string;
  notificationsAriaLabel?: string;
  children: ReactNode;
  className?: string;
}

export function ExploreView({
  heroSlides,
  onMenu,
  onNotifications,
  notificationCount,
  menuAriaLabel = "Open menu",
  notificationsAriaLabel = "Notifications",
  children,
  className,
}: ExploreViewProps) {
  const mainRef = useRef<HTMLElement>(null);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = el.scrollTop;
        const dy = y - lastY;
        if (y < 80) setHeaderHidden(false);
        else if (dy > 6) setHeaderHidden(true);
        else if (dy < -6) setHeaderHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`relative flex h-svh w-full overflow-hidden bg-background font-onest text-foreground${
        className ? ` ${className}` : ""
      }`}
    >
      <main ref={mainRef} className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Sticky top bar — slides away on scroll down, returns on scroll up */}
        <header
          className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex min-h-[62px] items-center justify-between px-6 py-4 bg-gradient-to-b from-background/40 via-background/15 to-transparent transition-transform duration-300 ease-out ${
            headerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={onMenu}
              className="flex h-9 w-9 items-center justify-center text-foreground/90 transition-opacity hover:opacity-70"
              aria-label={menuAriaLabel}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="pointer-events-auto flex items-center gap-1">
            <SystemStatusIndicator />
            <button
              onClick={onNotifications}
              className="relative flex h-9 w-9 items-center justify-center text-foreground/90 transition-opacity hover:opacity-70"
              aria-label={notificationsAriaLabel}
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              {notificationCount != null && notificationCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-primary px-[2px] text-[9px] font-semibold leading-[12px] text-primary-foreground">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Cinematic hero (full-bleed) */}
        <CinematicHero slides={heroSlides} />

        {/* Edge-to-edge content rows */}
        <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-6 md:px-8 lg:px-12">
          {children}
        </div>
      </main>

      <FloatingToolsFAB />
    </div>
  );
}

export default ExploreView;
