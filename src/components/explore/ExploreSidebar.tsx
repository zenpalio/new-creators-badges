import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Image as ImageIcon,
  Sparkles,
  Film,
  Plus,
  ChevronLeft,
  Coins,
} from "lucide-react";

const navTop = [
  { label: "Home", href: "/", icon: Home, exact: true },
  { label: "Explore", href: "/explore", icon: Compass, badge: "NEW" as const },
  { label: "Realistic", href: "/explore?cat=realistic", icon: ImageIcon, indent: true },
  { label: "Anime", href: "/explore?cat=anime", icon: Sparkles, indent: true },
  { label: "Gallery", href: "/explore/gallery", icon: ImageIcon },
  { label: "My Babes", href: "/explore/gallery?tab=babes", icon: Sparkles, indent: true },
  { label: "Reels", href: "/explore/reels", icon: Film },
];

const recentChats = [
  "Tanya", "Madeline", "Naomi", "Alice", "Lola", "Nyx",
  "Luna", "Paola", "Sakura", "Jenny", "Hikari", "Vexa",
];

const initials = (n: string) =>
  n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

const ExploreSidebar = () => {
  const { pathname } = useLocation();
  const isActive = (href: string, exact?: boolean) => {
    const path = href.split("?")[0];
    return exact ? pathname === path : pathname === path;
  };

  return (
    <aside
      className="fixed left-0 top-0 z-30 h-full w-sidebar-width flex-col border-r border-[#242529] bg-menu shadow-xl px-[17.75px] py-4 hidden md:flex"
    >
      {/* Logo + collapse */}
      <div className="flex items-center justify-between py-[9.25px] pl-2">
        <Link to="/" className="flex items-center gap-1.5">
          <span className="text-base font-extrabold tracking-tight text-foreground">
            mybabes<span className="text-primary">.ai</span>
          </span>
        </Link>
        <button className="inline-flex w-[33px] h-[33px] items-center justify-center rounded-[5px] hover:bg-grey-dark-1 transition-colors">
          <ChevronLeft className="h-5 w-5 text-grey-light-3" />
        </button>
      </div>

      {/* Scrollable nav */}
      <div className="flex flex-1 min-h-0 flex-col overflow-x-hidden pt-2 mb-auto scrollbar-hide">
        <nav className="flex flex-col gap-[4px]">
          {navTop.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`min-h-[42px] flex items-center gap-[8px] rounded-lg px-[14px] py-[7px] text-base font-[500] transition-colors ${
                  item.indent ? "pl-9" : ""
                } ${
                  active
                    ? "bg-grey-dark-1 text-white hover:bg-grey-dark-3"
                    : "text-grey-light-3 hover:bg-grey-dark-1 hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Create button */}
        <button className="mt-3 flex h-[42px] w-full items-center justify-center gap-2 rounded-lg bg-gradient-primary text-sm font-bold text-white hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Create
        </button>

        {/* Latest conversations */}
        <div className="mt-5 flex items-center gap-2 px-2 text-[13px] font-medium text-grey-light-4">
          <ChatIcon className="h-4 w-4" />
          Latest conversations
        </div>
        <div className="mt-2 flex flex-col gap-[2px]">
          {recentChats.map((name, i) => (
            <button
              key={i}
              className="flex items-center gap-2 rounded-lg px-[10px] py-[6px] text-sm text-grey-light-3 hover:bg-grey-dark-1 hover:text-white transition-colors text-left"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-grey-dark-2 text-[10px] font-bold text-grey-light-2 shrink-0">
                {initials(name)}
              </div>
              <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer: tokens + links */}
      <div className="border-t border-[#242529] pt-3 mt-2">
        <Link
          to="/explore/subscription"
          className="flex items-center justify-between rounded-lg bg-grey-dark-1 px-3 py-2 hover:bg-grey-dark-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-accent-yellow" />
            <span className="text-sm font-bold text-white">90,163.5</span>
          </div>
          <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold text-white">+</span>
        </Link>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 px-1 text-[11px] text-grey-light-4">
          <a href="#" className="hover:text-white">Terms & Privacy</a>
          <a href="#" className="hover:text-white">Guides</a>
        </div>
      </div>
    </aside>
  );
};

export default ExploreSidebar;
