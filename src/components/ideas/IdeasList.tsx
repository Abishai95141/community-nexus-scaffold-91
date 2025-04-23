
import { useState } from "react";
import { useIdeas } from "@/hooks/useIdeas";
import IdeaItem from "./IdeaItem";
import IdeasFilters from "./IdeasFilters";

export default function IdeasList() {
  const [tag, setTag] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: ideas, isLoading, error } = useIdeas({ tag, page, pageSize });

  return (
    <div>
      <IdeasFilters tag={tag} onTagChange={setTag} />
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: pageSize }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm min-h-[120px] bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500 mb-6">Error loading ideas: {error.message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ideas && ideas.length > 0 ? (
            ideas.map((idea) => <IdeaItem key={idea.id} idea={idea} />)
          ) : (
            <div className="col-span-full text-center text-muted-foreground pb-8">
              No ideas found
            </div>
          )}
        </div>
      )}

      {/* Simple pagination */}
      <div className="flex justify-center gap-4 pb-4">
        <button
          className="border rounded px-3 py-1"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="px-2">Page {page}</span>
        <button
          className="border rounded px-3 py-1"
          disabled={ideas && ideas.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
