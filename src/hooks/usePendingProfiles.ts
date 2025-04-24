
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePendingProfiles() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["pending-profiles"],
    queryFn: async () => {
      console.log("Fetching pending profiles...");
      // Make sure to enable debugging to see what's happening
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
      
      console.log("Pending profiles fetched:", data);
      return data || [];
    },
    refetchInterval: 10000, // Refetch every 10 seconds to keep data updated
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
}
