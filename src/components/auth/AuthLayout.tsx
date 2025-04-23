
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  footer,
  className,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-8">
      <div
        className={cn(
          "w-full max-w-md animate-fade-in space-y-6 rounded-lg border bg-card p-6 shadow-sm md:p-8",
          className
        )}
      >
        <div className="space-y-2 text-center">
          <Link to="/" className="mx-auto block">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold">CN</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </div>
      
      {footer && (
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
