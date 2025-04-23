import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PostgrestError } from "@supabase/supabase-js"; // Optional: Import for specific error typing

// Define the type for variables for clarity (optional but good practice)
type VoteVariables = {
  ideaId: string;
  value: 1 | -1;
};

export function useVoteIdea() {
  const queryClient = useQueryClient();

  // Explicitly provide generic types to useMutation
  return useMutation<
    boolean,         // TData: Type returned by mutationFn on success
    PostgrestError,  // TError: Type of error thrown (use Error if PostgrestError is not needed)
    VoteVariables,   // TVariables: Type of variables passed to mutationFn
    unknown          // TContext: Type for mutation context (use unknown if not using onMutate)
  >({
    mutationFn: async ({ ideaId, value }: VoteVariables) => { // Use the defined type here too
      // Note: Supabase RPC errors might be shaped differently, adjust TError if needed.
      // The { error } might be PostgrestError | null.
      const { error } = await supabase.rpc("vote_on_idea", {
        idea_id: ideaId,
        vote_value: value,
      });

      if (error) {
        // Ensure the thrown error matches the TError type
        console.error("Supabase RPC error:", error);
        throw error; // This error should ideally be PostgrestError
      }
      return true; // Matches TData: boolean
    },
    onSuccess: (_, variables) => {
      // Now TypeScript knows 'variables' is definitely of type VoteVariables
      queryClient.invalidateQueries({ queryKey: ["ideas"] }); // 'as const' is often not needed here
      queryClient.invalidateQueries({ queryKey: ["idea", variables.ideaId] }); // 'as const' is often not needed here
    },
    // Optional: Add onError for better error handling
    // onError: (error: PostgrestError) => {
    //   console.error("Mutation failed:", error);
    //   // Handle error, show notification, etc.
    // },
  });
}
