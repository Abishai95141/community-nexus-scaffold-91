
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

type VoteVariables = {
  ideaId: string;
  value: 1 | -1;
};

export function useVoteIdea() {
  const queryClient = useQueryClient();

  return useMutation<boolean, PostgrestError, VoteVariables, unknown>({
    mutationFn: async ({ ideaId, value }) => {
      const { error } = await supabase.rpc("vote_on_idea", { idea_id: ideaId, vote_value: value });
      if (error) {
        console.error("Supabase RPC error:", error);
        throw error;
      }
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", variables.ideaId] });
    },
    // Optionally add onError for debugging:
    // onError: (error) => {
    //   console.error("Vote mutation error:", error);
    // },
  });
}
