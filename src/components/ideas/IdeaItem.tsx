
import { useState } from "react";
import IdeaVoteButtons from "./IdeaVoteButtons";
import IdeaComments from "./IdeaComments";

interface IdeaItemProps {
  idea: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    vote_count: number;
    created_at: string;
    user_id: string;
  };
}

export default function IdeaItem({ idea }: IdeaItemProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => setShowComments((s) => !s)}>
            {idea.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {idea.tags?.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <IdeaVoteButtons ideaId={idea.id} voteCount={idea.vote_count || 0} />
      </div>
      {showComments && (
        <div className="mt-4 border-t pt-3">
          <IdeaComments ideaId={idea.id} />
        </div>
      )}
    </div>
  );
}
