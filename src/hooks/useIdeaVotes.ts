
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js";

type VoteVariables = {
  ideaId: string;
  value: 1 | -1;
};

export function useVoteIdea() {
  const queryClient = useQueryClient();

  // Fix types and use upsert for voting
  return useMutation<boolean, PostgrestError, VoteVariables, unknown>({
    mutationFn: async ({ ideaId, value }) => {
      // Get current user
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("User not authenticated");

      // Check existing vote
      const { data: existingVote, error: getError } = await supabase
        .from("idea_votes")
        .select("*")
        .eq("idea_id", ideaId)
        .eq("user_id", user.id)
        .maybeSingle();

      let result;
      if (!existingVote) {
        // Insert new vote
        result = await supabase.from("idea_votes").insert({
          idea_id: ideaId,
          user_id: user.id,
          value,
        });
      } else if (existingVote.value === value) {
        // Unvote (delete)
        result = await supabase.from("idea_votes")
          .delete()
          .eq("id", existingVote.id)
          .eq("user_id", user.id);
      } else {
        // Flip vote
        result = await supabase.from("idea_votes")
          .update({ value })
          .eq("id", existingVote.id)
          .eq("user_id", user.id);
      }

      if (result.error) {
        console.error("Supabase vote error:", result.error);
        throw result.error;
      }
      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate the idea list and individual idea
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["idea", variables.ideaId] });
    },
  });
}
