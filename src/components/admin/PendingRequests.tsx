
import { usePendingProfiles } from "@/hooks/usePendingProfiles";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X } from "lucide-react";

export function PendingRequests() {
  const { data: profiles, isLoading, error, refetch } = usePendingProfiles();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    setActionLoading(id + status);
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);
    setActionLoading(null);
    refetch();
  };

  if (isLoading) return <div className="p-4">Loading signup requests...</div>;
  if (error) return <div className="p-4 text-destructive">Error loading requests</div>;

  if (!profiles?.length)
    return <div className="p-4 text-muted-foreground">No pending signup requests.</div>;

  return (
    <div className="space-y-2">
      {profiles.map((profile: any) => (
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
              variant="secondary"
              disabled={actionLoading === profile.id + "approved"}
              onClick={() => handleUpdate(profile.id, "approved")}
            >
              <Check className="mr-1 w-4 h-4" /> Accept
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={actionLoading === profile.id + "rejected"}
              onClick={() => handleUpdate(profile.id, "rejected")}
            >
              <X className="mr-1 w-4 h-4" /> Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
