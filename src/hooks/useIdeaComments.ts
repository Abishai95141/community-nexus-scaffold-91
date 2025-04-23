
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// List comments for an idea
export function useIdeaComments(ideaId: string) {
  return useQuery({
    queryKey: ["idea-comments", ideaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, parent_id, user_id, created_at")
        .eq("idea_id", ideaId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!ideaId,
  });
}

// Stub: Post a comment (nested comments supported)
export function usePostComment(ideaId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      parentId,
    }: {
      content: string;
      parentId?: string | null;
    }) => {
      const { error, data } = await supabase
        .from("comments")
        .insert({ idea_id: ideaId, content, parent_id: parentId ?? null })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea-comments", ideaId] });
    },
  });
}
