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
  LayoutDashboard,
  Shield
} from "lucide-react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  { title: "Community", href: "/community", icon: Users },
];

const adminItems: NavItem[] = [
  { title: "Admin Panel", href: "/admin", icon: Shield },
];

function getNavItems(role: "admin" | "member" | null) {
  const items = [...navItems];
  if (role === "admin") {
    items.push(...adminItems);
  }
  return items;
}

export function NavLinks({ className, onNavClick }: NavLinksProps) {
  const { role, user } = useAuthUser();
  const location = useLocation();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (role === "admin") {
      setUserName("Admin");
    } else if (role === "member" && user?.id) {
      supabase
        .from("profiles")
        .select("name")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (data?.name) setUserName(data.name);
        });
    }
  }, [role, user]);

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
      {role &&
        <div className="px-4 py-2 text-xs text-muted-foreground mt-4">
          {userName ?? (user?.email ?? "")}
        </div>
      }
      <Button variant="ghost" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    </div>
  );
}
