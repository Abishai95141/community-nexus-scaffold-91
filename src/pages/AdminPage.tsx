
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SkeletonPage } from "@/components/ui/skeleton-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PendingRequests } from "@/components/admin/PendingRequests";

export default function AdminPage() {
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
        <title>Admin | Community Nexus</title>
      </Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your community platform</p>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Signup Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-2xl font-bold">256</h3>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <div className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-2xl font-bold">128</h3>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
              <div className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-2xl font-bold">512</h3>
                <p className="text-sm text-muted-foreground">Content Items</p>
              </div>
              <div className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-2xl font-bold">32</h3>
                <p className="text-sm text-muted-foreground">Pending Reports</p>
              </div>
            </div>
            <div className="mt-6 border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between border-b pb-2 last:border-0">
                    <div>
                      <div className="font-medium">Activity {i + 1}</div>
                      <div className="text-sm text-muted-foreground">User performed an action</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{i + 1} hour ago</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="requests">
            <div className="border rounded-lg shadow-sm">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">Pending Signup Requests</h3>
                <PendingRequests />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <div className="border rounded-lg shadow-sm">
              <div className="p-4">
                <h3 className="text-lg font-medium">Users Management</h3>
              </div>
              <div className="border-t">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-muted"></div>
                      <div>
                        <div className="font-medium">User {i + 1}</div>
                        <div className="text-sm text-muted-foreground">user{i+1}@example.com</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button className="text-sm text-red-600 hover:underline">Suspend</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="content" className="space-y-4">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Content Management</h3>
              <p className="text-muted-foreground text-sm">Manage community content</p>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-lg font-medium mb-2">Platform Settings</h3>
              <p className="text-muted-foreground text-sm">Configure your community platform</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
