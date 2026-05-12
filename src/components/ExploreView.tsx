import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { Bell, Menu } from "lucide-react";
import CinematicHero, {
  type CinematicHeroLabels,
  type HeroSlide,
} from "./explore/CinematicHero";
import SystemStatusIndicator from "./explore/SystemStatusIndicator";
import type { Service, SystemStatusIndicatorProps } from "./explore/SystemStatusIndicator";

export interface ExploreViewProps {
  heroSlides: HeroSlide[];
  /** Visible hero labels (supply defaults from the page, e.g. Explore) */
  heroLabels: CinematicHeroLabels;
  onMenu: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
  menuAriaLabel?: string;
  notificationsAriaLabel?: string;
  /** When set, shows a header status control if any service is not operational */
  systemStatus?: {
    services: Service[];
    message: string;
    statusLabels?: SystemStatusIndicatorProps["statusLabels"];
  };
  children: ReactNode;
  className?: string;
}

export function useHeaderScrollTracking(
  scrollRef: MutableRefObject<HTMLElement | null>,
  topOffset = 80,
  deltaThreshold = 6,
) {
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let lastY = el.scrollTop;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = el.scrollTop;
        const dy = y - lastY;
        if (y < topOffset) setHeaderHidden(false);
        else if (dy > deltaThreshold) setHeaderHidden(true);
        else if (dy < -deltaThreshold) setHeaderHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [deltaThreshold, scrollRef, topOffset]);

  return { headerHidden };
}

export interface ExploreNotificationsButtonProps {
  onClick?: () => void;
  notificationCount?: number;
  ariaLabel?: string;
}

export interface ExploreMenuButtonProps {
  onClick?: () => void;
  ariaLabel?: string;
}

export interface ExploreHeaderActionsProps {
  onNotifications?: () => void;
  notificationCount?: number;
  notificationsAriaLabel?: string;
  systemStatus?: ExploreViewProps["systemStatus"];
}

export function ExploreMenuButton({
  onClick,
  ariaLabel = "Open menu",
}: ExploreMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center text-foreground-v2/90 transition-opacity hover:opacity-70"
      aria-label={ariaLabel}
    >
      <Menu className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}

export function ExploreNotificationsButton({
  onClick,
  notificationCount,
  ariaLabel = "Notifications",
}: ExploreNotificationsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center text-foreground-v2/90 transition-opacity hover:opacity-70"
      aria-label={ariaLabel}
    >
      <Bell className="h-5 w-5" strokeWidth={1.5} />
      {notificationCount != null && notificationCount > 0 && (
        <span className="absolute right-1 top-1 flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-primary-v2 px-[2px] text-[9px] font-semibold leading-[12px] text-primary-v2-foreground">
          {notificationCount}
        </span>
      )}
    </button>
  );
}

export function ExploreHeaderActions({
  onNotifications,
  notificationCount,
  notificationsAriaLabel,
  systemStatus,
}: ExploreHeaderActionsProps) {
  return (
    <div className="pointer-events-auto flex items-center gap-1">
      {systemStatus ? (
        <SystemStatusIndicator
          services={systemStatus.services}
          message={systemStatus.message}
          statusLabels={systemStatus.statusLabels}
        />
      ) : null}
      <ExploreNotificationsButton
        onClick={onNotifications}
        notificationCount={notificationCount}
        ariaLabel={notificationsAriaLabel}
      />
    </div>
  );
}

export function ExploreView({
  heroSlides,
  heroLabels,
  onMenu,
  onNotifications,
  notificationCount,
  menuAriaLabel = "Open menu",
  notificationsAriaLabel = "Notifications",
  systemStatus,
  children,
  className,
}: ExploreViewProps) {
  const mainRef = useRef<HTMLElement>(null);
  const { headerHidden } = useHeaderScrollTracking(mainRef);

  return (
    <div
      className={`relative flex h-svh w-full overflow-hidden bg-background-v2 font-onest text-foreground-v2${
        className ? ` ${className}` : ""
      }`}
    >
      <main ref={mainRef} className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Sticky top bar — slides away on scroll down, returns on scroll up */}
        <header
          className={`pointer-events-none fixed inset-x-0 top-0 z-30 flex min-h-[62px] items-center justify-between px-6 py-4 bg-gradient-to-b from-background-v2/40 via-background-v2/15 to-transparent transition-transform duration-300 ease-out ${
            headerHidden ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="pointer-events-auto flex items-center gap-3">
            <ExploreMenuButton onClick={onMenu} ariaLabel={menuAriaLabel} />
          </div>
          <ExploreHeaderActions
            onNotifications={onNotifications}
            notificationCount={notificationCount}
            notificationsAriaLabel={notificationsAriaLabel}
            systemStatus={systemStatus}
          />
        </header>

        {/* Cinematic hero (full-bleed) */}
        <CinematicHero slides={heroSlides} labels={heroLabels} />

        {/* Edge-to-edge content rows */}
        <div className="relative z-10 flex w-full flex-col gap-6 px-4 pb-16 pt-6 md:px-8 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export default ExploreView;
