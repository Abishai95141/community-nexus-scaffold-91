
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVoteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ideaId,
      value,
    }: {
      ideaId: string;
      value: 1 | -1;
    }) => {
      // This stub implementation; backend logic pending
      // Upsert to idea_votes table or update existing vote
      const { error } = await supabase.rpc("vote_on_idea", { idea_id: ideaId, vote_value: value });
      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", variables.ideaId] });
    },
  });
}
