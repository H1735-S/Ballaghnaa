"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
          "transition-all duration-150 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            
            "bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:opacity-80":
              variant === "primary",
            
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            
            "text-muted-foreground hover:bg-accent hover:text-foreground":
              variant === "ghost",
            
            "border border-border bg-background text-foreground hover:bg-accent":
              variant === "outline",
            
            "bg-destructive text-white shadow-sm hover:opacity-90":
              variant === "danger",
          },
          {
            "h-8 px-3 text-xs":  size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-11 px-6 text-sm": size === "lg",
            "h-9 w-9 p-0":       size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
