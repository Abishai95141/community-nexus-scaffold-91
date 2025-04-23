
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useIdeas({ tag, page = 1, pageSize = 6 }: { tag?: string; page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["ideas", { tag, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from("ideas")
        .select("id, title, description, tags, vote_count, created_at, user_id")
        .order("created_at", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (tag) {
        query = query.contains("tags", [tag]);
      }
      const { data, error, count } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateIdea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newIdea: { title: string; description: string; tags: string[] }) => {
      const { error, data } = await supabase
        .from("ideas")
        .insert({ ...newIdea })
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
