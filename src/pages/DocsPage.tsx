
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function DocsPage() {
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
        <title>Docs & Resources | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Docs & Resources</h1>
          <p className="text-muted-foreground">Documentation and helpful resources</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium">Categories</h3>
              <div className="mt-3 space-y-2">
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Getting Started</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">API Documentation</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Tutorials</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">Best Practices</div>
                <div className="p-2 hover:bg-muted rounded cursor-pointer">FAQs</div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-4">Recent Documents</h3>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 border-b last:border-0">
                <h4 className="font-medium">Document {i + 1}</h4>
                <p className="text-sm text-muted-foreground">
                  Brief description of the document content
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
