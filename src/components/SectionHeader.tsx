import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-foreground-v2 font-bold text-sm uppercase tracking-wider">{title}</h2>
    <button className="p-1.5 rounded-full bg-muted-v2 hover:bg-accent-v2 transition-colors">
      <ChevronRight className="w-4 h-4 text-muted-v2-foreground" />
    </button>
  </div>
);

export default SectionHeader;
