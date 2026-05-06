import { cn } from "@/lib/utils";

interface CardProps { children: React.ReactNode; className?: string; }

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-border px-6 py-5", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn("text-sm font-semibold text-card-foreground", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardProps) {
  return (
    <p className={cn("mt-0.5 text-xs text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}
