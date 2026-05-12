import { NavLink } from "react-router-dom";
import { Compass, Users, Award, X, LogOut, Settings } from "lucide-react";

interface SideNavProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { label: "Explore", icon: Compass, to: "/" },
  { label: "Creators", icon: Users, to: "/creators" },
  { label: "Badges", icon: Award, to: "/badges" },
];

const SideNav = ({ open, onClose }: SideNavProps) => {
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[280px] bg-card-v2 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border-v2/40">
          <span className="text-foreground-v2 font-bold">Menu</span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-v2-foreground hover:bg-muted-v2 hover:text-foreground-v2"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {links.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-v2/15 text-primary-v2"
                    : "text-muted-v2-foreground hover:bg-muted-v2 hover:text-foreground-v2"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          <div className="my-2 h-px bg-border-v2/40" />
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-v2-foreground hover:bg-muted-v2 hover:text-foreground-v2 transition-colors">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-v2-foreground hover:bg-muted-v2 hover:text-foreground-v2 transition-colors">
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </nav>
      </aside>
    </div>
  );
};

export default SideNav;
