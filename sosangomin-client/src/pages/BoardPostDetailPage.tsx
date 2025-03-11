// src/pages/BoardPostDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import CommentList from "@/components/boards/CommentList";
import { ReplyType, CommentType, PostType } from "@/types/board";

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [post, setPost] = useState<PostType>({
    id: postId,
    title: "제목",
    content: "내용",
    author: "박보성",
    createdAt: "2025.03.06",
    views: 5,
    comments: [
      {
        id: 1,
        author: "박보성",
        content: "ㅋㅋㅋㅋ 빨리 후기 주세요",
        createdAt: "2024.03.06",
        replies: [
          {
            id: 101,
            author: "서지윤",
            content: "곧 올릴게요~",
            createdAt: "2024.03.06"
          }
        ]
      },
      {
        id: 2,
        author: "서지윤",
        content: "우왕 좋아요",
        createdAt: "2024.03.06",
        replies: []
      }
    ]
  });

  // 게시글 데이터 가져오기
  useEffect(() => {
    // TODO: 게시글 데이터를 가져오는 API 호출
    // 예시: fetchPost(postId).then(data => setPost(data));
  }, [postId]);

  const togglePostMenu = () => {
    setShowMenu(!showMenu);

    // 전역 이벤트를 통해 다른 메뉴들에게 닫히라는 신호 보내기
    if (!showMenu) {
      document.dispatchEvent(
        new CustomEvent("menu:toggle", {
          detail: { id: `post-${postId}` }
        })
      );
    }
  };

  // 다른 메뉴가 열릴 때 현재 메뉴 닫기
  useEffect(() => {
    const handleToggleMenu = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== `post-${postId}` && showMenu) {
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
  }, [postId, showMenu]);

  const handleEditPost = () => {
    navigate(`/community/board/edit/${postId}`, {
      state: { postId, postData: post }
    });
    setShowMenu(false);
  };

  const handleDeletePost = () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      // TODO: 게시글 삭제 API 호출
      console.log("게시글 삭제 API 호출:", postId);
      navigate("/community/board");
    }
    setShowMenu(false);
  };

  const handleAddComment = (content: string) => {
    // TODO: 댓글 추가 API 호출
    console.log("댓글 등록:", content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(postId).then(data => setPost(data));
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    // TODO: 댓글 수정 API 호출
    console.log("댓글 수정 API 호출:", commentId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(postId).then(data => setPost(data));
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      // TODO: 댓글 삭제 API 호출
      console.log("댓글 삭제 API 호출:", commentId);

      // API 호출 후 게시글 데이터 다시 불러오기
      // 예시: fetchPost(postId).then(data => setPost(data));
    }
  };

  const handleAddReply = (commentId: number, content: string) => {
    // TODO: 대댓글 추가 API 호출
    console.log("대댓글 등록:", commentId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(postId).then(data => setPost(data));
  };

  const handleUpdateReply = (
    commentId: number,
    replyId: number,
    content: string
  ) => {
    // TODO: 대댓글 수정 API 호출
    console.log("대댓글 수정 API 호출:", commentId, replyId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(postId).then(data => setPost(data));
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    // TODO: 대댓글 삭제 API 호출
    console.log("대댓글 삭제 API 호출:", commentId, replyId);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(postId).then(data => setPost(data));
  };

  return (
    <div className="w-full max-w-[1005px] mx-auto px-4 py-8">
      {/* 게시판 타이틀 */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">자유게시판</h2>
      </div>

      {/* 게시글 제목 */}
      <h1 className="text-2xl font-bold mb-3">{post.title}</h1>

      {/* 게시글 정보 */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <span>날짜 : {post.createdAt}</span>
          <span>|</span>
          <span>글쓴이 : {post.author}</span>
          <span>|</span>
          <span>조회수 : {post.views}</span>
        </div>
        <div className="relative menu-container">
          <button
            onClick={togglePostMenu}
            className="text-gray-500 cursor-pointer"
          >
            <FiMoreVertical className="h-5 w-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg z-10 py-1">
              <button
                onClick={handleEditPost}
                className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                수정하기
              </button>
              <button
                onClick={handleDeletePost}
                className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 구분선 */}
      <hr className="my-4 border-gray-300" />

      {/* 게시글 내용 */}
      <div className="my-6">
        <div className="whitespace-pre-wrap">{post.content}</div>
      </div>

      {/* 댓글 컴포넌트 */}
      <CommentList
        comments={post.comments}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
        onAddReply={handleAddReply}
        onUpdateReply={handleUpdateReply}
        onDeleteReply={handleDeleteReply}
      />
    </div>
  );
};

export default PostDetail;
