
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function TechTalksPage() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <SkeletonPage />;
  }
  
  return (
    <>
      <Helmet>
        <title>Tech Talks | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Talks</h1>
          <p className="text-muted-foreground">Webinars, conferences and knowledge sharing sessions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <div className="aspect-video bg-muted rounded-md mb-4"></div>
              <div className="text-sm text-muted-foreground mb-2">May {10 + i}, 2023</div>
              <h3 className="text-lg font-medium">Tech Talk {i + 1}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Brief description of this tech talk and its topic
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
