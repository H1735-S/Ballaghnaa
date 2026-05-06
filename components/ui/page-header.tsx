import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 flex items-center gap-2 sm:mt-0">{action}</div>}
    </div>
  );
}
