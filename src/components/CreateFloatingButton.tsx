import { Plus, Sparkles, Film, Image as ImageIcon, BookOpen, User, type LucideIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type Tool = { title: string; subtitle: string; Icon: LucideIcon; href: string };

const defaultTools: Tool[] = [
  { title: "Create Custom Babe", subtitle: "Design your dream character", Icon: Sparkles, href: "/explore/create-babe" },
  { title: "Video Generator", subtitle: "Bring scenes to life", Icon: Film, href: "/explore/video-generator" },
  { title: "Image Generator", subtitle: "Render any moment", Icon: ImageIcon, href: "/explore/image-generator" },
  { title: "Story Creator", subtitle: "Write episodic adventures", Icon: BookOpen, href: "/explore/story-creator" },
  { title: "Create Template Babe", subtitle: "Start from a preset", Icon: User, href: "/explore/create-template" },
];

const CreateFloatingButton = ({ tools = defaultTools }: { tools?: Tool[] }) => (
  <DropdownMenu>
    <DropdownMenuTrigger
      aria-label="Create content"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary-v2 px-5 py-3 text-sm font-semibold text-primary-v2-foreground shadow-xl shadow-primary-v2/30 hover:opacity-90 transition-opacity focus:outline-none"
    >
      <Plus className="h-5 w-5" />
      Create
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="end"
      side="top"
      className="min-w-[220px] rounded-xl border-white/5 bg-grey-dark-1-v2 p-1.5 shadow-xl mb-2"
    >
      {tools.map((t) => (
        <DropdownMenuItem
          key={t.title}
          onSelect={() => { window.location.href = t.href; }}
          className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer focus:bg-white/5"
        >
          <t.Icon className="h-4 w-4 mt-0.5 text-primary-v2 shrink-0" />
          <div className="flex flex-col">
            <span className="font-medium leading-tight">{t.title}</span>
            <span className="text-xs text-grey-light-3-v2">{t.subtitle}</span>
          </div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default CreateFloatingButton;
