// src/components/boards/EditComment.tsx

import React, { useState } from "react";
import { EditCommentProps } from "@/features/board/types/board";

const EditComment: React.FC<EditCommentProps> = ({
  comment,
  onUpdate,
  onCancel
}) => {
  const [content, setContent] = useState(comment.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onUpdate(comment.id, content);
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-2">
          <span className="font-medium text-sm">{comment.author}</span>
          <span className="text-xs text-gray-500">{comment.createdAt}</span>
        </div>
        <textarea
          className="w-full p-4 border border-border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2 sm:gap-3 mt-2 sm:mt-3 lg:mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-md text-sm sm:text-base lg:text-lg"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-bit-main text-white hover:bg-blue-900 px-4 py-2 text-sm rounded-md"
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
