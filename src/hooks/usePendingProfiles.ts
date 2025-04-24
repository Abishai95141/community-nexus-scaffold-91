
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePendingProfiles() {
  return useQuery({
    queryKey: ["pending-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      
      if (error) {
        console.error("Error fetching pending profiles:", error);
        throw error;
      }
      
      return data;
    },
  });
}
