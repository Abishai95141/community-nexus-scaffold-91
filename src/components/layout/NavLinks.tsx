import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Rocket, 
  FileText, 
  Users, 
  Layout,
  Book,
  LayoutDashboard
} from "lucide-react";

interface NavLinksProps {
  className?: string;
  onNavClick?: () => void;
  role?: "admin" | "member" | null;
}

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Ideas", href: "/ideas", icon: Book },
  { title: "Projects", href: "/projects", icon: Rocket },
  { title: "Docs & Resources", href: "/docs", icon: FileText },
  { title: "Tech Talks", href: "/talks", icon: Layout },
  { title: "Community", href: "/community", icon: Users }
];

function getNavItems(role: "admin" | "member" | null) {
  return navItems.filter(item =>
    item.title !== "Admin" || role === "admin"
  );
}

import { useAuthUser } from "@/hooks/useAuthUser";

export function NavLinks({ className, onNavClick }: NavLinksProps) {
  const { role } = useAuthUser();
  const location = useLocation();
  
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {getNavItems(role).map((item) => (
        <Button
          key={item.href}
          variant={location.pathname === item.href ? "default" : "ghost"}
          className={cn(
            "justify-start",
            location.pathname === item.href 
              ? "bg-primary text-primary-foreground" 
              : "hover:bg-transparent hover:underline"
          )}
          asChild
          onClick={onNavClick}
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
      <Button variant="ghost" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    </div>
  );
}
