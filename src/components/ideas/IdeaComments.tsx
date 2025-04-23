
import { useState } from "react";
import { useIdeaComments, usePostComment } from "@/hooks/useIdeaComments";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IdeaCommentsProps {
  ideaId: string;
}

// Recursive comment rendering
function Comment({
  comment,
  onReply,
  children,
}: {
  comment: any;
  onReply: (id: string) => void;
  children?: React.ReactNode;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { mutate, isLoading } = usePostComment(comment.idea_id);

  function handleReply() {
    mutate(
      { content: replyContent, parentId: comment.id },
      {
        onSuccess: () => {
          setReplyContent("");
          setShowReply(false);
        },
      }
    );
  }

  return (
    <div className="pl-2 mt-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">{comment.user_id?.slice(0, 8) ?? "User"}</span>
        <span className="text-muted-foreground text-xs">
          {new Date(comment.created_at).toLocaleString()}
        </span>
        <button className="ml-2 text-xs underline text-primary" onClick={() => setShowReply((s) => !s)}>
          Reply
        </button>
      </div>
      <div className="ml-3 pl-2 border-l">{comment.content}</div>
      {showReply && (
        <div className="ml-3 pl-2">
          <Input
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button 
            className="mt-1"
            size="sm"
            loading={isLoading}
            onClick={handleReply}
          >
            Post Reply
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

function renderThreadedComments(comments: any[], parentId: string | null) {
  return comments
    .filter((c) => c.parent_id === parentId)
    .map((comment) => (
      <Comment key={comment.id} comment={comment} onReply={() => {}}>
        {renderThreadedComments(comments, comment.id)}
      </Comment>
    ));
}

export default function IdeaComments({ ideaId }: IdeaCommentsProps) {
  const { data: comments, isLoading } = useIdeaComments(ideaId);
  const [newComment, setNewComment] = useState("");
  const postComment = usePostComment(ideaId);

  function handlePost() {
    if (!newComment.trim()) return;
    postComment.mutate(
      { content: newComment },
      { onSuccess: () => setNewComment("") }
    );
  }

  return (
    <div>
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="mb-2 flex gap-2">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button size="sm" loading={postComment.isLoading} onClick={handlePost}>
          Post
        </Button>
      </div>
      {isLoading ? (
        <div>Loading comments…</div>
      ) : comments && comments.length > 0 ? (
        <div>
          {renderThreadedComments(comments, null)}
        </div>
      ) : (
        <div className="text-muted-foreground">No comments yet</div>
      )}
    </div>
  );
}
