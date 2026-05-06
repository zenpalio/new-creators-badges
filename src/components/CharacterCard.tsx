import ChatIcon from "@/components/icons/ChatIcon";

interface CharacterCardProps {
  name: string;
  description: string;
  messageCount: number;
  imageUrl: string;
}

const CharacterCard = ({ name, description, messageCount, imageUrl }: CharacterCardProps) => {
  return (
    <div className="relative flex-shrink-0 w-[200px] h-[280px] rounded-xl overflow-hidden cursor-pointer group">
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-foreground font-semibold text-sm">{name}</h3>
        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{description}</p>
        <div className="flex items-center gap-1 mt-1.5 text-muted-foreground">
          <ChatIcon className="w-3.5 h-3.5" />
          <span className="text-xs">{messageCount}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default CharacterCard;
