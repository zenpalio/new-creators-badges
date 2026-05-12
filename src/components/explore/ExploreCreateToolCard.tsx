import { ChevronRight, type LucideIcon } from "lucide-react";

export interface ExploreCreateToolCardProps {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  href: string;
  onClick?: () => void;
}

const cardClass =
  "group relative flex w-full shrink-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1-v2 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-white/10";

const ExploreCreateToolCard = ({
  title,
  subtitle,
  Icon,
  href,
  onClick,
}: ExploreCreateToolCardProps) => (
  <a href={href} onClick={onClick} className={cardClass}>
    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-v2/15 blur-2xl transition-opacity duration-300 group-hover:bg-primary-v2/25" />

    <div className="relative flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Icon className="h-[18px] w-[18px] text-white" />
      </div>
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 backdrop-blur transition-all group-hover:bg-white group-hover:text-black">
        <ChevronRight className="h-4 w-4 text-current" />
      </div>
    </div>

    <div className="relative min-w-0">
      <h3 className="line-clamp-2 text-[15px] font-bold leading-tight text-white">{title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-snug text-grey-light-3-v2">{subtitle}</p>
    </div>
  </a>
);

export default ExploreCreateToolCard;
