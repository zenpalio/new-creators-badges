import { Home, Compass, Image, Heart, Film, Sparkles, ChevronLeft, MessageSquare, DollarSign, Bot } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Compass, label: "Explore" },
];

const categoryItems = [
  { icon: Image, label: "Gallery" },
  { icon: Heart, label: "My Babes" },
  { icon: Film, label: "Reels" },
];

const conversations = [
  { name: "Catalina", avatar: "C" },
  { name: "Fernanda", avatar: "F" },
  { name: "Carmen", avatar: "C" },
  { name: "Lumi", avatar: "L" },
  { name: "Ana", avatar: "A" },
  { name: "Ava", avatar: "A" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-sidebar-v2 z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-v2 flex items-center justify-center">
            <span className="text-primary-v2-foreground text-sm font-bold">M</span>
          </div>
          {!collapsed && <span className="text-foreground-v2 font-bold text-lg">mybabes</span>}
        </div>
        <button onClick={onToggle} className="text-muted-v2-foreground hover:text-foreground-v2 transition-colors">
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 mt-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              item.active
                ? "bg-sidebar-v2-active text-sidebar-v2-active-foreground"
                : "text-sidebar-v2-foreground hover:bg-sidebar-v2-hover hover:text-foreground-v2"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}

        {!collapsed && (
          <div className="flex gap-2 px-3 py-2">
            <button className="text-xs text-muted-v2-foreground hover:text-foreground-v2 transition-colors">Realistic</button>
            <button className="text-xs text-muted-v2-foreground hover:text-foreground-v2 transition-colors">Anime</button>
          </div>
        )}

        {categoryItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-v2-foreground hover:bg-sidebar-v2-hover hover:text-foreground-v2 transition-colors"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}

        {/* Create button */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full border border-border-v2 text-foreground-v2 hover:bg-sidebar-v2-hover transition-colors mt-4">
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Create</span>}
        </button>

        {/* Conversations */}
        {!collapsed && (
          <div className="mt-6">
            <p className="px-3 text-xs text-muted-v2-foreground uppercase tracking-wider mb-2">Latest conversations</p>
            <div className="space-y-0.5">
              {conversations.map((c) => (
                <button
                  key={c.name}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-v2-foreground hover:bg-sidebar-v2-hover transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-accent-v2 flex items-center justify-center text-xs text-muted-v2-foreground flex-shrink-0">
                    {c.avatar}
                  </div>
                  <span className="text-sm truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-2 pb-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-accent-v2 flex items-center justify-center text-sm text-foreground-v2 flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground-v2 truncate">Arthur</p>
              <p className="text-xs text-muted-v2-foreground truncate">@honest_zebra_6757</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="flex items-center justify-between px-2">
            <button className="p-2 text-muted-v2-foreground hover:text-foreground-v2 transition-colors">
              <DollarSign className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-v2-foreground hover:text-foreground-v2 transition-colors">
              <Bot className="w-5 h-5" />
            </button>
            <div className="text-sm text-muted-v2-foreground">🇺🇸</div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
