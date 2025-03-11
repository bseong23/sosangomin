// src/components/boards/CommentList.tsx

import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import Comment from "@/components/boards/Comment";
import EditComment from "@/components/boards/EditComment";
import CommentForm from "@/components/boards/CommentForm";
import { CommentListProps } from "@/types/board";

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onAddReply,
  onUpdateReply,
  onDeleteReply
}) => {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 전체 댓글 수 계산 (대댓글 포함)
  const getTotalCommentCount = () => {
    let count = 0;
    comments.forEach((comment) => {
      count++; // 메인 댓글
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length; // 대댓글
      }
    });
    return count;
  };

  const handleEditComment = (commentId: number) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    onUpdateComment(commentId, content);
    setEditingCommentId(null);
  };

  return (
    <div>
      {/* 댓글 카운트 */}
      <div className="flex items-center gap-2 my-4">
        <FaRegComment className="fill-gray-600" />
        <span className="text-gray-600">{getTotalCommentCount()}</span>
      </div>

      {/* 구분선 */}
      <hr className="my-4 border-gray-300" />

      {/* 댓글 입력 폼 */}
      <div className="my-6">
        <CommentForm onSubmit={onAddComment} />
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6 my-6">
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            {editingCommentId === comment.id ? (
              <EditComment
                comment={comment}
                onUpdate={handleUpdateComment}
                onCancel={handleCancelEdit}
              />
            ) : (
              <Comment
                comment={comment}
                onEdit={handleEditComment}
                onDelete={onDeleteComment}
                onAddReply={onAddReply}
                onEditReply={onUpdateReply}
                onDeleteReply={onDeleteReply}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
