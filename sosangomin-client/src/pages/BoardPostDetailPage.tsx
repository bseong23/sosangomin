// src/pages/BoardPostDetailPage.tsx
import React, { useState, useEffect, useRef } from "react";
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
  const [isAuthor, setIsAuthor] = useState(false);
  const isFetched = useRef(false);

  useEffect(() => {
    if (isFetched.current) return; // 이미 실행되었으면 API 호출하지 않음
    isFetched.current = true; // 처음 실행되면 true로 설정

    const fetchPostAndAuthorization = async () => {
      if (!boardId) return;

      setLoading(true);

      try {
        // 게시글 데이터 가져오기
        const data = await fetchBoardPost(boardId);
        // API 응답 구조에 맞게 데이터 매핑
        setPost({
          id: data.boardId.toString(),
          title: data.title,
          content: data.content,
          author: data.name,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
          views: data.views,
          comments: post.comments
        });
        setError(null);

        // 권한 확인
        try {
          await verifyBoardPost(boardId);
          setIsAuthor(true); // 권한이 있으면 `isAuthor`를 `true`로 변경
        } catch (error: any) {
          if (error.response?.status === 401) {
            console.warn("작성자가 아님 (401 Unauthorized)");
            setIsAuthor(false);
          } else {
            console.error("게시글 검증 중 오류 발생:", error);
          }
        }
      } catch (error) {
        console.error("게시글을 불러오는데 실패했습니다:", error);
        setError("게시글을 불러오는데 실패했습니다. 다시 시도해주세요.");
        setIsAuthor(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndAuthorization();
  }, [boardId]);

  const togglePostMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleEditPost = async () => {
    if (!isAuthor) {
      alert("게시글을 수정할 권한이 없습니다.");
      return;
    }
    navigate(`/community/board/edit/${boardId}`, {
      state: { boardId, postData: post }
    });
    setShowMenu(false);
  };

  const handleDeletePost = async () => {
    if (!isAuthor) {
      alert("게시글을 삭제할 권한이 없습니다.");
      return;
    }

    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteBoardPost(boardId!);
        alert("게시글이 성공적으로 삭제되었습니다.");
        navigate("/community/board");
      } catch (error: any) {
        console.error("게시글 삭제 실패:", error);

        if (error.response?.status === 401) {
          alert("게시글을 삭제할 권한이 없습니다.");
        } else if (error.response?.status === 404) {
          alert("존재하지 않는 게시글입니다.");
          navigate("/community/board");
        } else {
          alert("게시글 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    }
    setShowMenu(false);
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

          {/* 내가 작성한 글일 때만 수정,삭제 보이게 */}
          {isAuthor && (
            <div className="relative menu-container">
              <button
                onClick={togglePostMenu}
                className="text-comment-text cursor-pointer p-1"
                aria-label="게시글 옵션 메뉴"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-30 bg-basic-white rounded-md shadow-lg z-10 overflow-hidden border border-border">
                  <button
                    onClick={handleEditPost}
                    className="block w-full text-center px-4 py-2 text-sm text-comment hover:bg-gray-100 cursor-pointer border-b border-border"
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
          )}
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
        <CommentList boardId={boardId!} />
      </div>
    </div>
  );
};

export default PostDetail;
