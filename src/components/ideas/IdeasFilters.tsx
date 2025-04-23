
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface IdeasFiltersProps {
  tag?: string;
  onTagChange: (tag: string) => void;
}

export default function IdeasFilters({ tag, onTagChange }: IdeasFiltersProps) {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await supabase.from("tags").select("name");
      if (!error && data) {
        setTags(data.map((d: { name: string }) => d.name));
      }
    }
    fetchTags();
  }, []);

  return (
    <div className="flex items-center gap-4 py-2 mb-4">
      <span className="text-sm font-medium mr-3">Filter by tag:</span>
      <button
        type="button"
        key="all"
        className={`px-2 py-1 rounded hover:bg-primary/10 ${!tag ? "bg-primary/10 font-semibold" : ""}`}
        onClick={() => onTagChange("")}
      >
        All
      </button>
      {tags.map((t) => (
        <button
          key={t}
          className={`px-2 py-1 rounded hover:bg-primary/10 ${tag === t ? "bg-primary/10 font-semibold" : ""}`}
          onClick={() => onTagChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
