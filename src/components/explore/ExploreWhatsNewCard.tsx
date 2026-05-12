import { ArrowUpRight } from "lucide-react";

export interface ExploreWhatsNewCardProps {
  tag: string;
  date: string;
  title: string;
  description: string;
  href?: string;
  readMoreLabel?: string;
  onClick?: () => void;
}

const ExploreWhatsNewCard = ({
  tag,
  date,
  title,
  description,
  href = "#",
  readMoreLabel = "Read more",
  onClick,
}: ExploreWhatsNewCardProps) => (
  <a href={href} onClick={onClick} className="block shrink-0">
    <div className="group flex h-full w-[300px] shrink-0 flex-col gap-2 rounded-2xl border border-white/[0.06] bg-grey-dark-1-v2/60 p-4 text-left transition-colors hover:border-white/10 hover:bg-grey-dark-1-v2">
      <div className="flex items-center gap-2 text-[11px] font-medium">
        <span className="rounded-full bg-primary-v2/15 px-2 py-0.5 text-primary-v2">{tag}</span>
        <span className="text-grey-light-4-v2">{date}</span>
      </div>
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">{title}</h3>
      <p className="line-clamp-2 text-xs leading-snug text-grey-light-3-v2">{description}</p>
      <div className="mt-auto flex items-center gap-1 pt-1 text-xs font-medium text-grey-light-3-v2 transition-colors group-hover:text-white">
        <span>{readMoreLabel}</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </div>
  </a>
);

export default ExploreWhatsNewCard;
