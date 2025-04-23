
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Map of path segments to display names
  const displayNames: Record<string, string> = {
    ideas: "Ideas",
    projects: "Projects",
    docs: "Docs & Resources",
    talks: "Tech Talks",
    community: "Community",
    admin: "Admin"
  };

  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
        </li>
        
        {pathSegments.map((segment, index) => {
          const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const displayName = displayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          return (
            <React.Fragment key={url}>
              <li>/</li>
              <li className={isLast ? "text-foreground font-medium truncate max-w-[150px] sm:max-w-none" : ""}>
                {isLast ? (
                  displayName
                ) : (
                  <Link to={url} className="hover:text-foreground transition-colors">
                    {displayName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
