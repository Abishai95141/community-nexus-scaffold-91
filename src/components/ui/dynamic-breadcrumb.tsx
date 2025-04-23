
import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export function DynamicBreadcrumb() {
  const location = useLocation();
  
  // Track path changes for automatic breadcrumb updates
  React.useEffect(() => {
    // Update page title based on path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageName = pathSegments.length > 0 
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
      : 'Home';
    
    document.title = `${pageName} | Community Nexus`;
  }, [location.pathname]);
  
  return <Breadcrumbs />;
}
