import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardPost } from "@/features/board/api/boardApi";
import { isLoggedIn } from "@/features/auth/api/userStorage";

const WritePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      // setIsCheckingAuth(true);
      try {
        // 인증 유틸리티를 사용하여 로그인 상태 확인
        if (!isLoggedIn()) {
          // 로그인되지 않은 경우
          alert("로그인이 필요한 서비스입니다.");
          navigate("/community/board");
          return;
        }
      } catch (error) {
        console.error("로그인 상태 확인 중 오류:", error);
        navigate("/community/board");
      }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await createBoardPost({ title, content });

      // 성공 메시지 표시
      alert("게시글이 성공적으로 등록되었습니다.");

      // 게시글 상세 페이지로 이동 (서버에서 반환한 값 사용)
      if (response && response.boardId) {
        console.log("이동할 url:", `/community/board/${response}`);
        navigate(`/community/board/${response.boardId}`);
      } else {
        console.log("이동할 URL:", `/community/board/${response}`);
        navigate("/community/board");
      }
    } catch (error: any) {
      console.error("게시글 등록 실패:", error);
      if (error.response) {
        // 401 alert 제거 (중복 알림 방지)
        if (error.response.status !== 401) {
          alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // 취소 확인
    if (title.trim() || content.trim()) {
      if (
        !window.confirm("작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?")
      ) {
        return;
      }
    }
    // 게시판 목록으로 돌아감
    navigate("/community/board");
  };

  return (
    <div className="w-full max-w-[972px] mx-auto px-4 py-10">
      <div className="w-full mb-8">
        <h1 className="text-xl font-bold">게시글 작성</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full mb-6">
          <input
            type="text"
            placeholder="제목을 입력해 주세요."
            className="w-full p-4 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="w-full mb-6">
          <textarea
            placeholder="내용을 입력해 주세요."
            className="w-full h-[400px] p-4 border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-border text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md w-[116px] h-[40px]"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-bit-main text-basic-white hover:bg-blue-900 px-4 py-2 rounded-md w-[116px] h-[40px]"
            disabled={isLoading}
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
