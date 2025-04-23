
import { cn } from "@/lib/utils";
import { NavLinks } from "./NavLinks";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 min-w-[220px] hidden md:block", className)}>
      <div className="space-y-4 py-4 sticky top-[6.5rem]">
        <div className="px-3 py-2">
          <div className="mb-2">
            <h2 className="px-4 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
          </div>
          <NavLinks />
        </div>
        <Separator />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Favorites
          </h2>
          <div className="space-y-1 p-2 text-sm text-muted-foreground">
            <p className="p-2">Your pinned items will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
