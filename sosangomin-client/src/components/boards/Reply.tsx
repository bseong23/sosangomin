// src/components/comments/Reply.tsx

import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

interface ReplyProps {
  reply: {
    id: number;
    author: string;
    content: string;
    createdAt: string;
  };
  commentId: number; // 부모 댓글 ID
  onEdit: (commentId: number, replyId: number) => void;
  onDelete: (commentId: number, replyId: number) => void;
}

const Reply: React.FC<ReplyProps> = ({
  reply,
  commentId,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleReplyMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEditReply = () => {
    onEdit(commentId, reply.id);
    setShowMenu(false);
  };

  const handleDeleteReply = () => {
    onDelete(commentId, reply.id);
    setShowMenu(false);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-md">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm">{reply.author}</span>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{reply.createdAt}</span>
          <div className="relative">
            <button onClick={toggleReplyMenu} className="text-gray-500">
              <FiMoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 py-1">
                <button
                  onClick={handleEditReply}
                  className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  수정하기
                </button>
                <button
                  onClick={handleDeleteReply}
                  className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-gray-800 text-sm">{reply.content}</p>
    </div>
  );
};

export default Reply;
