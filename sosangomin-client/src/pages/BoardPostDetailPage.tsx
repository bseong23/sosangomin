// src/pages/BoardPostDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import CommentList from "@/features/board/components/boards/CommentList";
import { PostType } from "@/features/board/types/board";
// import eye from "@/assets/eye.svg";

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
          },
          {
            id: 102,
            author: "김도형",
            content: "빨리 주세요",
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
      },
      {
        id: 3,
        author: "권인승",
        content: "재밌어요",
        createdAt: "2024.03.06",
        replies: []
      }
    ]
  });

  // 게시글 데이터 가져오기
  useEffect(() => {
    // TODO: 게시글 데이터를 가져오는 API 호출
    const fetchPost = async () => {
      try {
        // API 호출 예시 코드:
        // const response = await fetch(`/api/posts/${postId}`);
        // const data = await response.json();
        // setPost(data);

        // 임시 데이터로 setPost 사용 (실제 API 구현 전까지)
        setPost((prevPost) => ({
          ...prevPost
          // 여기서 필요한 데이터 업데이트
        }));
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다:", error);
      }
    };

    fetchPost();
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
    <div className="flex flex-col w-full sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* 게시판 타이틀 */}
      <div className="w-full">
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <h2 className="text-2xl font-bold text-bit-main">자유게시판</h2>
        </div>

        {/* 게시글 제목 */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">
          {post.title}
        </h1>

        {/* 게시글 정보 */}
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-comment-text text-xs ">
            <span>날짜 : {post.createdAt}</span>
            <span></span>
            <span>글쓴이 : {post.author}</span>
            <span></span>
            <span>조회수 : {post.views}</span>
          </div>
          <div className="relative menu-container">
            <button
              onClick={togglePostMenu}
              className="text-comment-text cursor-pointer p-1"
              aria-label="게시글 옵션 메뉴"
            >
              <FiMoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-24 bg-basic-white rounded-md shadow-lg z-10 overflow-hidden border border-border">
                <button
                  onClick={handleEditPost}
                  className="block w-full text-center px-4 py-2 text-sm text-comment hover:bg-gray-100 cursor-pointer"
                >
                  수정하기
                </button>
                <button
                  onClick={handleDeletePost}
                  className="block w-full text-center px-4 py-2 text-sm text-comment hover:bg-red-500 hover:text-basic-white cursor-pointer"
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <hr className="my-3 sm:my-4 border-border" />

        {/* 게시글 내용 */}
        <div className="my-4 sm:my-5 lg:my-6">
          <div className="min-h-[150px] sm:min-h-[200px] lg:min-h-[250px] text-lg">
            {post.content}
          </div>
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
    </div>
  );
};

export default PostDetail;
