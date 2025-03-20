// src/components/boards/CommentList.tsx

import React, { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import Comment from "@/features/board/components/boards/Comment";
import EditComment from "@/features/board/components/boards/EditComment";
import CommentForm from "@/features/board/components/boards/CommentForm";
import { CommentType } from "@/features/board/types/board";
import {
  fetchComments,
  addComment,
  updateComment,
  deleteComment
} from "@/features/board/api/commentApi";

const CommentList: React.FC<{ boardId: string }> = ({ boardId }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 댓글 불러오기
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(boardId);
        setComments(
          data.map((comment: any) => ({
            id: comment.commentId,
            author: comment.name,
            content: comment.content,
            createdAt: new Date(comment.createdAt).toLocaleString(),
            isVerified: comment.isVerified
          }))
        );
        setError(null);
      } catch (error) {
        console.error("댓글을 불러오는데 실패했습니다:", error);
        setError("댓글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [boardId]);

  // 댓글 작성
  const handleAddComment = async (content: string) => {
    try {
      await addComment(boardId, content);
      const data = await fetchComments(boardId);
      setComments(
        data.map((comment: any) => ({
          id: comment.commentId,
          author: comment.name,
          content: comment.content,
          createdAt: new Date(comment.createdAt).toLocaleString(),
          isVerified: comment.isVerified
        }))
      );
    } catch (error: any) {
      if (error.response?.status === 404) {
        alert("게시글이 존재하지 않습니다.");
      } else {
        alert("로그인하고 댓글을 작성해보세요!");
      }
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number, content: string) => {
    try {
      await updateComment(commentId, content);
      const data = await fetchComments(boardId);
      setComments(
        data.map((comment: any) => ({
          id: comment.commentId,
          author: comment.name,
          content: comment.content,
          createdAt: new Date(comment.createdAt).toLocaleString(),
          isVerified: comment.isVerified
        }))
      );
      setEditingCommentId(null);
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("댓글을 수정할 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("존재하지 않는 댓글입니다.");
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment(commentId); // 🔥 API 호출
      const data = await fetchComments(boardId); // 🔥 최신 댓글 다시 불러오기
      setComments(
        data.map((comment: any) => ({
          id: comment.commentId,
          author: comment.name,
          content: comment.content,
          createdAt: new Date(comment.createdAt).toLocaleString(),
          isVerified: comment.isVerified
        }))
      );
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("댓글을 삭제할 권한이 없습니다.");
      } else if (error.response?.status === 404) {
        alert("존재하지 않는 댓글입니다.");
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <p className="text-center py-4">댓글 불러오는 중...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div>
      {/* 댓글 카운트 */}
      <div className="flex items-center gap-2 my-4">
        <FaRegComment className="fill-gray-600" />
        <span className="text-gray-600">{comments.length}</span>
      </div>

      {/* 구분선 */}
      <hr className="my-4 border-gray-300" />

      {/* 댓글 입력 폼 */}
      <div className="my-6">
        <CommentForm onSubmit={handleAddComment} />
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6 my-6">
        {comments.map((comment) => (
          <React.Fragment key={comment.id}>
            {editingCommentId === comment.id ? (
              <EditComment
                comment={comment}
                onUpdate={handleUpdateComment}
                onCancel={() => setEditingCommentId(null)}
              />
            ) : (
              <Comment
                comment={comment}
                onEdit={setEditingCommentId}
                onDelete={handleDeleteComment}
                onAddReply={() => {}}
                onEditReply={() => {}}
                onDeleteReply={() => {}}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
