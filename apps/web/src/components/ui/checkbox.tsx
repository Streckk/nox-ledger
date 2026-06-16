import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
};

/**
 * Checkbox accesible: input nativo oculto + indicador estilizado vía peer.
 * Compatible con react-hook-form (reenvía ref y props del register).
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "group inline-flex cursor-pointer items-center gap-2.5 text-[13px] text-muted select-none",
          className,
        )}
      >
        <span className="relative inline-flex">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer size-[18px] cursor-pointer appearance-none rounded-[6px] border border-hairline-strong bg-elevated outline-none transition-colors checked:border-invert checked:bg-invert focus-visible:ring-2 focus-visible:ring-ink/15"
            {...props}
          />
          <Check className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-invert-ink opacity-0 transition-opacity peer-checked:opacity-100" />
        </span>
        {label}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
