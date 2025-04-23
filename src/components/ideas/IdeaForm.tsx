
import { useState } from "react";
import { useCreateIdea } from "@/hooks/useIdeas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function IdeaForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useCreateIdea();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title required");
      return;
    }
    setError(null);
    mutate({
      title,
      description,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setTitle("");
    setDescription("");
    setTagsInput("");
  }

  return (
    <form className="bg-muted/50 p-4 rounded-lg mb-6" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-2">Share a new idea</h2>
      <div className="space-y-3">
        <Input
          placeholder="Title"
          disabled={isPending}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="Description"
          disabled={isPending}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Tags (comma-separated)"
          disabled={isPending}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Idea"
          )}
        </Button>
      </div>
    </form>
  );
}
