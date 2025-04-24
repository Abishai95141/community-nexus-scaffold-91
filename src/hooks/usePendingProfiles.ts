
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePendingProfiles() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["pending-profiles"],
    queryFn: async () => {
      console.log("Fetching pending profiles...");
      
      // Make sure we're fetching with proper authentication
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error("No authenticated session found");
        throw new Error("Authentication required");
      }
      
      // Check if user is admin
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("User data not available");
      }
      
      console.log("Authenticated user:", userData.user.id);
      
      // Fetch pending profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching pending profiles:", error);
        toast({
          title: "Error fetching pending profiles",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      console.log("Pending profiles fetched:", data?.length || 0, "profiles found");
      console.log("Profiles data:", data);
      
      return data || [];
    },
    refetchInterval: 10000, // Refetch every 10 seconds to keep data updated
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
