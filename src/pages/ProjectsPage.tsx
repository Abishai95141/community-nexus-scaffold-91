
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <SkeletonPage cardCount={6} />;
  }
  
  return (
    <>
      <Helmet>
        <title>Projects | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Community projects and initiatives</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <div className="h-32 bg-muted rounded-md mb-4"></div>
              <h3 className="text-lg font-medium">Project {i + 1}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Project description placeholder
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
