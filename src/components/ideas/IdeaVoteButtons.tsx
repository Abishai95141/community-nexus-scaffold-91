
import { useVoteIdea } from "@/hooks/useIdeaVotes";

interface IdeaVoteButtonsProps {
  ideaId: string;
  voteCount: number;
}
export default function IdeaVoteButtons({ ideaId, voteCount }: IdeaVoteButtonsProps) {
  const { mutate: vote, isLoading } = useVoteIdea();

  return (
    <div className="flex items-center gap-4">
      <button
        className="px-2 py-0.5 border rounded bg-background hover:bg-primary/10"
        disabled={isLoading}
        onClick={() => vote({ ideaId, value: 1 })}
        aria-label="Upvote"
      >
        ▲
      </button>
      <span className="font-bold">{voteCount}</span>
      <button
        className="px-2 py-0.5 border rounded bg-background hover:bg-primary/10"
        disabled={isLoading}
        onClick={() => vote({ ideaId, value: -1 })}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
}
