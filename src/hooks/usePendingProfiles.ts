
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePendingProfiles() {
  return useQuery({
    queryKey: ["pending-profiles"],
    queryFn: async () => {
      console.log("Fetching pending profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching pending profiles:", error);
        throw error;
      }
      
      console.log("Pending profiles fetched:", data);
      return data || [];
    },
  });
}
