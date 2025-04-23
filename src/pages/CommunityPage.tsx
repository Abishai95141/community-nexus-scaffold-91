
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function CommunityPage() {
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
        <title>Community | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Connect with community members</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Community Activity</h3>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 items-start p-3 border-b last:border-0">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div>
                    <div className="font-medium">User Name {i + 1}</div>
                    <p className="text-sm text-muted-foreground">
                      Posted a new discussion topic
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">{i + 1} hour ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="border rounded-lg p-4 shadow-sm mb-6">
              <h3 className="text-lg font-medium mb-4">Members Online</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted" />
                ))}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
                  +24
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Upcoming Events</h3>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 border-b last:border-0">
                  <div className="font-medium">Event {i + 1}</div>
                  <p className="text-sm text-muted-foreground">
                    May {15 + i}, 2023 • 8:00 PM
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
