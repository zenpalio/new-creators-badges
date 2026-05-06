import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface HScrollProps {
  children: ReactNode;
}

const HScroll = ({ children }: HScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [children]);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <div className="group/scroll relative">
      {canLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 group-hover/scroll:opacity-100 md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 group-hover/scroll:opacity-100 md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
      <div
        ref={ref}
        className="scrollbar-hide flex gap-2 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 [-webkit-overflow-scrolling:touch] [touch-action:pan-x]"
      >
        {children}
      </div>
    </div>
  );
};

export default HScroll;
