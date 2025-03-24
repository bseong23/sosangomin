// src/components/boards/Comment.tsx

import React, { useState, useEffect } from "react";
import { FiMoreVertical, FiCornerDownRight } from "react-icons/fi";
// import { FaRegComments } from "react-icons/fa";
import CommentForm from "@/features/board/components/boards/CommentForm";
import Reply from "@/features/board/components/boards/Reply";
import EditReply from "@/features/board/components/boards/EditReply";
import { CommentProps } from "@/features/board/types/board";
import useAuthStore from "@/store/useAuthStore";

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

  const { userInfo } = useAuthStore();

  const toggleCommentMenu = () => {
    setShowMenu(!showMenu);

    // 전역 이벤트를 통해 다른 메뉴들에게 닫히라는 신호 보내기
    if (!showMenu) {
      document.dispatchEvent(
        new CustomEvent("menu:toggle", {
          detail: { id: `comment-${comment.id}` }
        })
      );
    }
  };

  // 다른 메뉴가 열릴 때 현재 메뉴 닫기
  useEffect(() => {
    const handleToggleMenu = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== `comment-${comment.id}` && showMenu) {
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
  }, [comment.id, showMenu]);

  // const toggleReplyForm = () => {
  //   setShowReplyForm(!showReplyForm);
  // };

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
    console.log(`댓글 ${commentId}의 답글 ${replyId} 수정 중`);
    setEditingReplyId(replyId);
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
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

  const getProfileImage = (): string => {
    if (comment.profileUrl) {
      return comment.profileUrl;
    }
    // 댓글 작성자가 현재 로그인한 사용자와 같으면 userInfo의 프로필 사용
    if (
      userInfo &&
      comment.author === userInfo.userName &&
      userInfo.userProfileUrl
    ) {
      return userInfo.userProfileUrl;
    }

    // 기본 이미지 표시 (fallback)
    return "/images/default-profile.png"; // 서버에 기본 이미지 파일이 있어야 함
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between w-full mb-10">
        {/* 프로필 이미지 추가 */}
        <div className="flex items-center">
          <div className="mr-3">
            <img
              src={getProfileImage()}
              alt={`${comment.author} 프로필`}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패 시 기본 이미지로 대체
                e.currentTarget.src = "/src/assets/profileImage.svg";
              }}
            />
          </div>
          <span className="font-medium">{comment.author}</span>
        </div>
        <div className="flex items-center">
          <span className="text-s text-gray-500 mr-3">{comment.createdAt}</span>

          {/* isVerified==true 일때만 수정,삭제 보이게 */}
          {comment.isVerified && (
            <div className="relative menu-container">
              <button
                onClick={toggleCommentMenu}
                className="text-gray-500 cursor-pointer"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 py-1 overflow-hidden">
                  <button
                    onClick={handleEditComment}
                    className="block w-full text-center px-4 py-2 text-sm text-comment hover:bg-gray-100 cursor-pointer border-b border-border"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDeleteComment}
                    className="block w-full text-center px-4 py-2 text-sm text-comment hover:bg-red-500 hover:text-basic-white cursor-pointer"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-800">{comment.content}</p>
        {/* 대댓글 영역 */}
        {/* <div className="flex justify-end">
          <button
            onClick={toggleReplyForm}
            className="text-sm hover:text-blue-800 flex items-center gap-1"
          >
            <FaRegComments className="fill-gray-600" />
            댓글달기
          </button>
        </div> */}
      </div>

      {/* 대댓글 입력 폼 */}
      {showReplyForm && (
        <div className="mt-2 ml-8">
          <CommentForm
            onSubmit={handleAddReply}
            placeholder="댓글을 작성하세요."
            buttonText="댓글 작성"
          />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          <div className="ml-8 border-t border-gray-200"></div>
          <div className="ml-8 space-y-3">
            {comment.replies.map((reply, index) => (
              <React.Fragment key={reply.id}>
                {/* 첫 번째 대댓글이 아닐 경우에만 구분선 표시 */}
                {index > 0 && <div className="border-t border-gray-200"></div>}
                <div className="flex items-start">
                  <FiCornerDownRight className="mr-2 mt-6 text-gray-500" />
                  <div className="flex-1">
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
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
