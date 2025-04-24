import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileNav from "./MobileNav";
import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";
import { useAuthUser } from "@/hooks/useAuthUser";
import { supabase } from "@/integrations/supabase/client";

export default function Header({ className }: { className?: string }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { role, user } = useAuthUser();
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
    <header className={cn("border-b border-border sticky top-0 bg-background z-50", className)}>
      <div className="container flex h-16 items-center px-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <img 
              src="/logo.png" 
              alt="Builders Arc Logo" 
              className="h-8 w-8 rounded-md"
            />
            <span className="font-bold hidden sm:inline-block text-lg">Builders Arc</span>
          </Link>
        </div>
        
        <div className={`mx-auto flex items-center space-x-4 ${isSearchFocused ? 'w-full sm:w-72 md:w-96' : 'w-auto'} transition-all duration-300`}>
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..."
              className="pl-8 w-full"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>
        
        <div className="hidden md:flex items-center">
          <nav className="flex items-center space-x-1">
            {role ? (
              <>
                <span className="text-muted-foreground mr-2">{userName ?? user?.email}</span>
                <Button variant="ghost" onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/auth";
                }}>Sign Out</Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
      
      <div className="container flex h-10 items-center border-t px-4">
        <Breadcrumbs />
      </div>
      
      {showMobileMenu && (
        <MobileNav onClose={() => setShowMobileMenu(false)} />
      )}
    </header>
  );
}
