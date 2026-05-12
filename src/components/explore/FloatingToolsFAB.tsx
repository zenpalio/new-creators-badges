import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingToolsFabItem {
  icon: ComponentType<{ className?: string }>;
  label: ReactNode;
  ariaLabel: string;
  onClick: () => void;
}

export interface FloatingToolsFabMainButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FloatingToolsFabMainButton = ({
  isOpen,
  onToggle,
}: FloatingToolsFabMainButtonProps) => (
  <button
    onClick={onToggle}
    aria-label={isOpen ? "Close menu" : "Open create menu"}
    aria-expanded={isOpen}
    className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-v2 shadow-lg shadow-primary-v2/30 transition-all hover:shadow-xl hover:brightness-110 active:scale-90"
  >
    <span
      className={`flex items-center justify-center transition-transform duration-300 ${
        isOpen ? "rotate-[135deg]" : "rotate-0"
      }`}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-primary-v2-foreground" />
      ) : (
        <Plus className="h-6 w-6 text-primary-v2-foreground" />
      )}
    </span>

    {/* Pulse ring when closed */}
    {!isOpen && (
      <span
        className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-primary-v2/40"
        style={{ animationDuration: "3s" }}
      />
    )}
  </button>
);

/**
 * Floating action button anchored bottom-right of the viewport that fans out
 * a stack of creation tools on click. Ported from Creative Studio (motion-free).
 */
export interface FloatingToolsFABProps {
  items: FloatingToolsFabItem[];
  backdropClassName?: string;
  contentClassName?: string;

}

const FloatingToolsFAB = ({ items, backdropClassName, contentClassName }: FloatingToolsFABProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(`fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`, backdropClassName)}
      />

      <div className={cn("fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-3", contentClassName)}>
        {/* Tool buttons stack */}
        {items.map((tool, i) => {
          const Icon = tool.icon;
          // Reverse index so the first tool sits closest to the FAB
          const reverseIdx = items.length - 1 - i;
          return (
            <button
              key={i}
              onClick={() => {
                tool.onClick();
                setIsOpen(false);
              }}
              aria-label={tool.ariaLabel}
              className={`group relative flex items-center transition-all duration-200 ease-out ${
                isOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-3 scale-75 opacity-0"
              }`}
              style={{ transitionDelay: isOpen ? `${reverseIdx * 40}ms` : "0ms" }}
            >
              {/* Label tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-border-v2 bg-card-v2 px-2.5 py-1 text-xs font-medium text-foreground-v2 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {tool.label}
              </span>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border-v2 bg-card-v2 shadow-lg transition-all hover:scale-110 hover:bg-muted-v2 hover:shadow-xl">
                <Icon className="h-5 w-5 text-foreground-v2" />
              </div>
            </button>
          );
        })}

        <FloatingToolsFabMainButton isOpen={isOpen} onToggle={() => setIsOpen((o) => !o)} />
      </div>
    </>
  );
};

export default FloatingToolsFAB;
