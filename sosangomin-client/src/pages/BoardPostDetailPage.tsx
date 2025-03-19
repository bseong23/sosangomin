// src/pages/BoardPostDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";
import CommentList from "@/features/board/components/boards/CommentList";
import { PostType } from "@/features/board/types/board";
import {
  fetchBoardPost,
  deleteBoardPost,
  verifyBoardPost
} from "@/features/board/api/boardApi";

const PostDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [post, setPost] = useState<PostType>({
    id: boardId,
    title: "",
    content: "",
    author: "",
    createdAt: "",
    views: 0,
    comments: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 게시글 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!boardId) return;

      setLoading(true);
      try {
        const data = await fetchBoardPost(boardId);
        // API 응답 구조에 맞게 데이터 매핑
        setPost({
          id: data.boardId.toString(),
          title: data.title,
          content: data.content,
          author: data.name,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
          views: data.views,
          comments: post.comments // 현재는 댓글 API가 따로 있을 수 있으므로 기존 상태 유지
        });
        setError(null);

        // 사용자 권한 확인 (게시글 수정/삭제 가능 여부)
        try {
          await verifyBoardPost(boardId);
        } catch (verifyError) {
          // 권한이 없으면 수정/삭제 버튼을 표시하지 않음
          // 여기서는 에러 메시지를 표시하지 않음 (정상적인 상황일 수 있음)
        }
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다:", error);
        setError("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [boardId]);

  const togglePostMenu = () => {
    setShowMenu(!showMenu);

    // 전역 이벤트를 통해 다른 메뉴들에게 닫히라는 신호 보내기
    if (!showMenu) {
      document.dispatchEvent(
        new CustomEvent("menu:toggle", {
          detail: { id: `post-${boardId}` }
        })
      );
    }
  };

  // 다른 메뉴가 열릴 때 현재 메뉴 닫기
  useEffect(() => {
    const handleToggleMenu = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== `post-${boardId}` && showMenu) {
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
  }, [boardId, showMenu]);

  const handleEditPost = async () => {
    try {
      if (!boardId) return;

      // 권한 확인 API 호출
      await verifyBoardPost(boardId);

      // 권한이 있는 경우 수정 페이지로 이동
      navigate(`/community/board/edit/${boardId}`, {
        state: { boardId, postData: post }
      });
    } catch (error) {
      console.error("권한 확인 실패:", error);
      alert("게시글을 수정할 권한이 없습니다.");
    }

    setShowMenu(false);
  };

  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        if (!boardId) return;

        await deleteBoardPost(boardId);
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/community/board");
      } catch (error: any) {
        console.error("게시글 삭제 실패:", error);

        // 에러 응답에 따른 처리
        if (error.response) {
          if (error.response.status === 401) {
            alert("게시글을 삭제할 권한이 없습니다.");
          } else if (error.response.status === 404) {
            alert("존재하지 않는 게시글입니다.");
            navigate("/community/board");
          } else {
            alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
          }
        } else {
          alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
    setShowMenu(false);
  };

  const handleAddComment = (content: string) => {
    // TODO: 댓글 추가 API 호출
    console.log("댓글 등록:", content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(boardId).then(data => setPost(data));
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    // TODO: 댓글 수정 API 호출
    console.log("댓글 수정 API 호출:", commentId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(boardId).then(data => setPost(data));
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      // TODO: 댓글 삭제 API 호출
      console.log("댓글 삭제 API 호출:", commentId);

      // API 호출 후 게시글 데이터 다시 불러오기
      // 예시: fetchPost(boardId).then(data => setPost(data));
    }
  };

  const handleAddReply = (commentId: number, content: string) => {
    // TODO: 대댓글 추가 API 호출
    console.log("대댓글 등록:", commentId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(boardId).then(data => setPost(data));
  };

  const handleUpdateReply = (
    commentId: number,
    replyId: number,
    content: string
  ) => {
    // TODO: 대댓글 수정 API 호출
    console.log("대댓글 수정 API 호출:", commentId, replyId, content);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(boardId).then(data => setPost(data));
  };

  const handleDeleteReply = (commentId: number, replyId: number) => {
    // TODO: 대댓글 삭제 API 호출
    console.log("대댓글 삭제 API 호출:", commentId, replyId);

    // API 호출 후 게시글 데이터 다시 불러오기
    // 예시: fetchPost(boardId).then(data => setPost(data));
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <p className="text-center py-10">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <p className="text-center py-10 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
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
          <div className="min-h-[150px] sm:min-h-[200px] lg:min-h-[250px] text-sm">
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
