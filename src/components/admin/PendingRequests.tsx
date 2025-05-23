
import { usePendingProfiles } from "@/hooks/usePendingProfiles";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingRequests() {
  const { data: profiles, isLoading, error, refetch } = usePendingProfiles();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [pendingAction, setPendingAction] = useState<"approved" | "rejected" | null>(null);
  const { toast } = useToast();
  
  console.log("PendingRequests component rendering with profiles:", profiles);
  
  const handleViewDetails = (profile: any) => {
    setSelectedProfile(profile);
    setIsDialogOpen(true);
    setPendingAction(null);
  };

  const handleApproveReject = async (status: "approved" | "rejected") => {
    setPendingAction(status);
  };

  const handleConfirmAction = async () => {
    if (!selectedProfile || !pendingAction) return;
    
    setActionLoading(selectedProfile.id + pendingAction);
    
    const { data: userData } = await supabase.auth.getUser();
    const adminId = userData.user?.id;
    
    if (!adminId) {
      toast({
        title: "Error",
        description: "Admin ID not found. Please log in again.",
        variant: "destructive",
      });
      setActionLoading(null);
      return;
    }
    
    // Update profile status
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ status: pendingAction })
      .eq("id", selectedProfile.id);
    
    if (profileError) {
      console.error("Error updating profile status:", profileError);
      toast({
        title: "Error",
        description: `Failed to ${pendingAction === "approved" ? "approve" : "reject"} user: ${profileError.message}`,
        variant: "destructive",
      });
      setActionLoading(null);
      return;
    }
    
    // Add to approval history
    const { error: historyError } = await supabase
      .from("approval_history")
      .insert([{
        admin_id: adminId,
        user_id: selectedProfile.id,
        status: pendingAction,
        notes: notes.trim() || null
      }]);
    
    if (historyError) {
      console.error("Error saving approval history:", historyError);
    }
    
    setActionLoading(null);
    setIsDialogOpen(false);
    setNotes("");
    setPendingAction(null);
    refetch();
    
    toast({
      title: "Success",
      description: `User ${pendingAction === "approved" ? "approved" : "rejected"} successfully`,
      variant: "default",
    });
  };

  // Manually trigger a refetch to ensure we have the latest data
  const handleManualRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Looking for new signup requests...",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button size="sm" variant="outline" disabled>Refreshing...</Button>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) return (
    <>
      <div className="p-4 text-destructive border border-destructive/30 rounded-md bg-destructive/10 mb-4">
        Error loading requests: {String(error)}
      </div>
      <Button onClick={handleManualRefresh} size="sm" variant="outline">
        Try Again
      </Button>
    </>
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline" onClick={handleManualRefresh}>
          Refresh Requests
        </Button>
      </div>
      
      {!profiles?.length ? (
        <div className="p-6 text-center text-muted-foreground border rounded-lg">
          <p className="mb-3">No pending signup requests.</p>
          <p className="text-sm">New signup requests will appear here for your approval.</p>
        </div>
      ) : (
        profiles.map((profile: any) => (
          <div key={profile.id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <div className="font-medium">{profile.name}</div>
              <div className="text-xs text-muted-foreground">
                Email: {profile.email || "-"} • Age: {profile.age} • Gender: {profile.gender} • Dept: {profile.department}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleViewDetails(profile)}
              >
                <Eye className="mr-1 w-4 h-4" /> Details
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-green-500 hover:bg-green-600 text-white"
                disabled={actionLoading === profile.id + "approved"}
                onClick={() => {
                  setSelectedProfile(profile);
                  handleApproveReject("approved");
                  setIsDialogOpen(true);
                }}
              >
                <Check className="mr-1 w-4 h-4" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={actionLoading === profile.id + "rejected"}
                onClick={() => {
                  setSelectedProfile(profile);
                  handleApproveReject("rejected");
                  setIsDialogOpen(true);
                }}
              >
                <X className="mr-1 w-4 h-4" /> Reject
              </Button>
            </div>
          </div>
        ))
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pendingAction 
                ? `${pendingAction === "approved" ? "Approve" : "Reject"} User Request` 
                : "User Details"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction
                ? `Are you sure you want to ${pendingAction === "approved" ? "approve" : "reject"} this user?`
                : "Review user signup request details"}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfile && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="font-medium text-sm">Name:</div>
                <div>{selectedProfile.name}</div>
                
                <div className="font-medium text-sm">Email:</div>
                <div>{selectedProfile.email || "-"}</div>
                
                <div className="font-medium text-sm">Age:</div>
                <div>{selectedProfile.age}</div>
                
                <div className="font-medium text-sm">Gender:</div>
                <div>{selectedProfile.gender}</div>
                
                <div className="font-medium text-sm">Department:</div>
                <div>{selectedProfile.department}</div>
                
                <div className="font-medium text-sm">Registered:</div>
                <div>{new Date(selectedProfile.created_at).toLocaleString()}</div>
              </div>
              
              {pendingAction && (
                <div className="mt-2">
                  <label className="text-sm font-medium block mb-1">Admin notes (optional)</label>
                  <Textarea
                    placeholder="Add any notes about this decision..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setPendingAction(null);
                setNotes("");
              }}
            >
              Cancel
            </Button>
            
            {pendingAction && (
              <Button
                type="button"
                variant={pendingAction === "approved" ? "default" : "destructive"}
                onClick={handleConfirmAction}
                disabled={actionLoading !== null}
              >
                {actionLoading ? "Processing..." : pendingAction === "approved" ? "Approve User" : "Reject User"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
