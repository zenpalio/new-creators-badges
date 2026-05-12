import { Heart } from "lucide-react";
import ChatIcon from "@/components/icons/ChatIcon";

interface ModelCardProps {
  name: string;
  description: string;
  messageCount: string;
  likeCount: string;
  imageUrl: string;
}

const ModelCard = ({ name, description, messageCount, likeCount, imageUrl }: ModelCardProps) => {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[280px] rounded-xl overflow-hidden cursor-pointer group">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background-v2/90 via-background-v2/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-foreground-v2 font-semibold text-sm truncate">{name}</h3>
        <p className="text-muted-v2-foreground text-xs mt-0.5 line-clamp-2">{description}</p>
        <div className="flex items-center gap-3 mt-1.5 text-muted-v2-foreground">
          <div className="flex items-center gap-1">
            <ChatIcon className="w-3.5 h-3.5" />
            <span className="text-xs">{messageCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span className="text-xs">{likeCount}</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-foreground-v2/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default ModelCard;
