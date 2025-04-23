
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// List comments for an idea
export function useIdeaComments(ideaId: string) {
  return useQuery({
    queryKey: ["idea-comments", ideaId],
    queryFn: async () => {
      // Temporarily return mock data until database setup is complete
      return [];
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
      // Stub implementation until database setup is complete
      console.log("Adding comment:", { ideaId, content, parentId });
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["idea-comments", ideaId] });
    },
  });
}
