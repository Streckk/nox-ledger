import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-bold leading-none tracking-tight",
  {
    variants: {
      variant: {
        neutral:
          "bg-elevated text-muted border border-hairline",
        solid: "bg-invert text-invert-ink",
        positive:
          "bg-positive/10 text-positive border border-positive/20",
        negative:
          "bg-negative/10 text-negative border border-negative/20",
        outline: "border border-hairline-strong text-ink",
      },
      size: {
        sm: "px-2.5 py-1 text-[11px]",
        md: "px-3 py-1.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { badgeVariants };
