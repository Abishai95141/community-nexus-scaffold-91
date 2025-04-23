
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileNav from "./MobileNav";
import { Breadcrumbs } from "./Breadcrumbs";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">CN</span>
            </div>
            <span className="font-bold hidden sm:inline-block">Community Nexus</span>
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
            <Button variant="ghost" asChild>
              <Link to="/profile">Profile</Link>
            </Button>
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
