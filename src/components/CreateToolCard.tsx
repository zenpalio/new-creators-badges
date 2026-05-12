import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CreateToolCardProps {
  title: string;
  color: string;
  icon: ReactNode;
}

const CreateToolCard = ({ title, color, icon }: CreateToolCardProps) => (
  <div className="flex-shrink-0 w-[220px] flex items-center gap-3 bg-card-v2 rounded-xl p-3 cursor-pointer hover:bg-accent-v2 transition-colors group">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-foreground-v2 font-semibold text-sm leading-tight">{title}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-v2-foreground flex-shrink-0" />
  </div>
);

export default CreateToolCard;
