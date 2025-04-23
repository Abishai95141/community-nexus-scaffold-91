
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";

export default function HomePage() {
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
        <title>Home | Builders Arc</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home</h1>
          <p className="text-muted-foreground">Welcome to Builders Arc</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest community activities</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium">My Spaces</h3>
            <p className="text-sm text-muted-foreground mt-1">Quick access to your spaces</p>
          </div>
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-medium">Announcements</h3>
            <p className="text-sm text-muted-foreground mt-1">Important community announcements</p>
          </div>
        </div>
      </div>
    </>
  );
}
