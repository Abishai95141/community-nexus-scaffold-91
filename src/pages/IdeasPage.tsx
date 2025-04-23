
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function IdeasPage() {
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
        <title>Ideas | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ideas</h1>
          <p className="text-muted-foreground">Browse and share community ideas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content placeholder grid */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium">Idea placeholder {i + 1}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This is a placeholder for community ideas and discussions
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
