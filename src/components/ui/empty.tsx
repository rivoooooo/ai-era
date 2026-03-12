import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "warning" | "error";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, action, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: {
        container: "bg-[var(--card)] border-[var(--border)]",
        icon: "text-[var(--muted-foreground)]",
        title: "text-[var(--foreground)]",
        description: "text-[var(--muted-foreground)]",
      },
      warning: {
        container: "bg-[var(--warning)]/10 border-[var(--warning)]/30",
        icon: "text-[var(--warning)]",
        title: "text-[var(--warning)]",
        description: "text-[var(--warning)]/80",
      },
      error: {
        container: "bg-[var(--error)]/10 border-[var(--error)]/30",
        icon: "text-[var(--error)]",
        title: "text-[var(--error)]",
        description: "text-[var(--error)]/80",
      },
    };

    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border p-8 text-center",
          styles.container,
          className
        )}
        {...props}
      >
        {icon && (
          <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]", styles.icon)}>
            {icon}
          </div>
        )}
        {title && (
          <h3 className={cn("mb-2 text-lg font-semibold", styles.title)}>
            {title}
          </h3>
        )}
        {description && (
          <p className={cn("mb-6 text-sm max-w-md", styles.description)}>
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
