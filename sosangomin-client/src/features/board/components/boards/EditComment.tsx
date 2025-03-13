// src/components/boards/EditComment.tsx

import React, { useState } from "react";
import { EditCommentProps } from "@/features/board/types/board";

const EditComment: React.FC<EditCommentProps> = ({
  comment,
  onUpdate,
  onCancel
}) => {
  const [editContent, setEditContent] = useState(comment.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    onUpdate(comment.id, editContent);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-2">
          <span className="font-medium">{comment.author}</span>
          <span className="text-sm text-gray-500">{comment.createdAt}</span>
        </div>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-4 py-2 rounded-md"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-[#16125D] text-white hover:bg-blue-900 px-4 py-2 rounded-md"
          >
            수정완료
          </button>
        </div>
      </form>

      {/* 대댓글이 있을 경우 표시 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-8 space-y-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm">{reply.author}</span>
                <span className="text-xs text-gray-500">{reply.createdAt}</span>
              </div>
              <p className="text-gray-800 text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditComment;
