import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring-v2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-v2 text-primary-v2-foreground hover:bg-primary-v2/80",
        secondary: "border-transparent bg-secondary-v2 text-secondary-v2-foreground hover:bg-secondary-v2/80",
        destructive: "border-transparent bg-destructive-v2 text-destructive-v2-foreground hover:bg-destructive-v2/80",
        outline: "text-foreground-v2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
