import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    const base = cn(
      "h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground",
      "placeholder:text-muted-foreground",
      "transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30",
      className
    );

    if (icon) {
      return (
        <div className="relative flex items-center">
          <span className="absolute left-3 text-muted-foreground pointer-events-none">{icon}</span>
          <input ref={ref} className={cn(base, "pl-9")} {...props} />
        </div>
      );
    }
    return <input ref={ref} className={base} {...props} />;
  }
);
Input.displayName = "Input";
