
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// List Ideas with optional tag filter and pagination
export function useIdeas({ tag, page = 1, pageSize = 6 }: { tag?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["ideas", { tag, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from("ideas")
        .select("*")
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (tag) {
        query = query.contains("tags", [tag]);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    },
  });
}

// Create idea and assign to current user
export function useCreateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newIdea: { title: string; description: string; tags: string[] }) => {
      // Get user id from supabase.auth
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("ideas")
        .insert({
          user_id: user.id,
          title: newIdea.title,
          description: newIdea.description,
          tags: newIdea.tags,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
}
