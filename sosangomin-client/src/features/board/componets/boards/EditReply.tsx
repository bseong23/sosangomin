// src/components/boards/EditReply.tsx

import React, { useState } from "react";
import { EditReplyProps } from "@/types/board";

const EditReply: React.FC<EditReplyProps> = ({
  reply,
  commentId,
  onUpdate,
  onCancel
}) => {
  const [editContent, setEditContent] = useState(reply.content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    onUpdate(commentId, reply.id, editContent);
  };

  return (
    <div className="bg-gray-50 p-3 mt-3 rounded-md">
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-5">
          <span className="font-medium">{reply.author}</span>
          <span className="text-gray-500">{reply.createdAt}</span>
        </div>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[#16125D] text-white hover:bg-blue-900 px-4 py-2 rounded-md"
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
    </div>
  );
};

export default EditReply;
