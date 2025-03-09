// src/components/comments/Comment.tsx

import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegComments } from "react-icons/fa";
import CommentForm from "@/components/boards/CommentForm";
import Reply from "@/components/boards/Reply";
import EditReply from "@/components/boards/EditReply";

interface ReplyType {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

interface CommentProps {
  comment: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
    replies?: ReplyType[];
  };
  onEdit: (commentId: number) => void;
  onDelete: (commentId: number) => void;
  onAddReply: (commentId: number, content: string) => void;
  onEditReply: (commentId: number, replyId: number, content: string) => void;
  onDeleteReply: (commentId: number, replyId: number) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  onEdit,
  onDelete,
  onAddReply,
  onEditReply,
  onDeleteReply
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);

  const toggleCommentMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleEditComment = () => {
    onEdit(comment.id);
    setShowMenu(false);
  };

  const handleDeleteComment = () => {
    onDelete(comment.id);
    setShowMenu(false);
  };

  const handleAddReply = (content: string) => {
    onAddReply(comment.id, content);
    setShowReplyForm(false);
  };

  const handleEditReply = (commentId: number, replyId: number) => {
    setEditingReplyId(replyId);
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    if (window.confirm("정말로 이 대댓글을 삭제하시겠습니까?")) {
      onDeleteReply(commentId, replyId);
    }
  };

  const handleUpdateReply = (
    commentId: number,
    replyId: number,
    content: string
  ) => {
    onEditReply(commentId, replyId, content);
    setEditingReplyId(null);
  };

  const handleCancelEditReply = () => {
    setEditingReplyId(null);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex justify-between mb-2">
        <span className="font-medium">{comment.author}</span>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-3">
            {comment.createdAt}
          </span>
          <div className="relative">
            <button onClick={toggleCommentMenu} className="text-gray-500">
              <FiMoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 py-1">
                <button
                  onClick={handleEditComment}
                  className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  수정하기
                </button>
                <button
                  onClick={handleDeleteComment}
                  className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-800">{comment.content}</p>

      {/* 대댓글 영역 */}
      <div className="mt-2 flex justify-end">
        <FaRegComments className="fill-gray-600" />
        <button
          onClick={toggleReplyForm}
          className="text-sm hover:text-blue-800"
        >
          댓글달기
        </button>
      </div>

      {/* 대댓글 입력 폼 */}
      {showReplyForm && (
        <div className="mt-2 ml-8">
          <CommentForm
            onSubmit={handleAddReply}
            placeholder="대댓글을 작성하세요."
            buttonText="대댓글 작성"
          />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <React.Fragment key={reply.id}>
              {editingReplyId === reply.id ? (
                <EditReply
                  reply={reply}
                  commentId={comment.id}
                  onUpdate={handleUpdateReply}
                  onCancel={handleCancelEditReply}
                />
              ) : (
                <Reply
                  reply={reply}
                  commentId={comment.id}
                  onEdit={handleEditReply}
                  onDelete={handleDeleteReply}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
