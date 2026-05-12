import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background-v2 group-[.toaster]:text-foreground-v2 group-[.toaster]:border-border-v2 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-v2-foreground",
          actionButton: "group-[.toast]:bg-primary-v2 group-[.toast]:text-primary-v2-foreground",
          cancelButton: "group-[.toast]:bg-muted-v2 group-[.toast]:text-muted-v2-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
