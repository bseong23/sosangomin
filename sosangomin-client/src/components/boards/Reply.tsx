// src/components/boards/Reply.tsx

import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { ReplyProps } from "@/types/board";

const Reply: React.FC<ReplyProps> = ({
  reply,
  commentId,
  onEdit,
  onDelete
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleReplyMenu = () => {
    setShowMenu(!showMenu);

    // 전역 이벤트를 통해 다른 메뉴들에게 닫히라는 신호 보내기
    if (!showMenu) {
      document.dispatchEvent(
        new CustomEvent("menu:toggle", {
          detail: { id: `reply-${commentId}-${reply.id}` }
        })
      );
    }
  };

  // 다른 메뉴가 열릴 때 현재 메뉴 닫기
  useEffect(() => {
    const handleToggleMenu = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== `reply-${commentId}-${reply.id}` && showMenu) {
        setShowMenu(false);
      }
    };

    // 외부 클릭 감지
    const handleClickOutside = (event: MouseEvent) => {
      const element = event.target as Element;
      if (!element.closest(".menu-container") && showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener("menu:toggle", handleToggleMenu as EventListener);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "menu:toggle",
        handleToggleMenu as EventListener
      );
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [commentId, reply.id, showMenu]);

  const handleEditReply = () => {
    onEdit(commentId, reply.id);
    setShowMenu(false);
  };

  const handleDeleteReply = () => {
    onDelete(commentId, reply.id);
    setShowMenu(false);
  };

  return (
    <div className="w-full bg-gray-50 mt-2">
      <div className="py-5 px-4">
        <div className="flex justify-between mb-10">
          <span className="font-medium">{reply.author}</span>
          <div className="flex items-center">
            <span className="text-gray-500 mr-3">{reply.createdAt}</span>
            <div className="relative menu-container">
              <button
                onClick={toggleReplyMenu}
                className="text-gray-500 cursor-pointer"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 py-1 overflow-hidden">
                  <button
                    onClick={handleEditReply}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDeleteReply}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-800 ">{reply.content}</p>
      </div>
    </div>
  );
};

export default Reply;
