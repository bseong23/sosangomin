import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  fetchNoticePost,
  updateNoticePost,
  verifyNoticePost
} from "@/features/board/api/noticeApi";

interface BoardPost {
  title: string;
  content: string;
}

type ApiError = {
  response?: {
    status: number;
    data?: any;
  };
  message?: string;
};

const NoticePostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  const location = useLocation();
  const postData = location.state?.postData as BoardPost | undefined;

  const [post, setPost] = useState<BoardPost>({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 값 업데이트 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (postData) {
      // location.state로부터 데이터를 받은 경우
      setPost(postData);
      setIsLoading(false);
    } else if (noticeId) {
      loadPostData();
    } else {
      // boardId가 없는 경우
      setError("게시글 ID가 유효하지 않습니다.");
      setIsLoading(false);
    }
  }, [noticeId, postData]);

  const loadPostData = async () => {
    if (!noticeId) return;

    try {
      setIsLoading(true);

      // 권한 확인
      try {
        await verifyNoticePost();
      } catch (verifyError) {
        handleApiError(verifyError as ApiError, true);
        return; // 권한 검증 실패 시 데이터 로드 중단
      }

      // 데이터 로드
      const data = await fetchNoticePost(noticeId);
      setPost({
        title: data.title,
        content: data.content
      });
      setError(null);
    } catch (error) {
      handleApiError(error as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  // API 에러 처리 통합 함수
  const handleApiError = (error: ApiError, isVerifyError = false) => {
    console.error(
      isVerifyError
        ? "권한 확인 중 오류 발생"
        : "게시글 데이터 로드 중 오류 발생",
      error
    );

    if (!error.response) {
      setError("서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
      return;
    }

    const { status } = error.response;

    if (status === 401) {
      setError("이 게시글을 수정할 권한이 없습니다.");
      navigate(`/community/notice/post/${noticeId}`, { replace: true });
    } else if (status === 404) {
      setError("존재하지 않는 게시글입니다.");
      navigate("/community/notice", { replace: true });
    } else {
      setError(`게시글을 불러오는데 실패했습니다. (오류 코드: ${status})`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("폼 제출 시도");

    // 폼 유효성 검사
    if (!post.title.trim() || !post.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      console.log("수정 요청 전송:", noticeId, post);

      if (noticeId) {
        const result = await updateNoticePost(noticeId, {
          title: post.title,
          content: post.content
        });
        console.log("수정 결과:", result);
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate(`/community/notice/post/${noticeId}`);
      } else {
        console.error("게시글 ID가 없습니다");
        alert("게시글 ID가 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("수정 실패:", error);
      handleSubmitError(error as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  // 제출 에러 처리 함수
  const handleSubmitError = (error: ApiError) => {
    console.error("게시글 수정 중 오류 발생", error);

    if (!error.response) {
      alert("서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
      return;
    }

    const { status } = error.response;

    if (status === 401) {
      alert("게시글을 수정할 권한이 없습니다.");
      navigate(`/community/notice/post/${noticeId}`, { replace: true });
    } else if (status === 404) {
      alert("존재하지 않는 게시글입니다.");
      navigate("/community/notice", { replace: true });
    } else {
      alert(`게시글 수정에 실패했습니다. (오류 코드: ${status})`);
    }
  };

  const handleCancel = () => {
    // 상세 페이지로 돌아감
    navigate(`/community/notice/post/${noticeId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[972px] mx-auto px-4 py-10 flex justify-center">
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[972px] mx-auto px-4 py-10 flex justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[972px] mx-auto px-4 py-10">
      <div className="w-full mb-8">
        <h1 className="text-2xl font-bold">게시글 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="w-full mb-6">
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해 주세요."
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-full mb-6">
          <textarea
            name="content"
            placeholder="내용을 입력해 주세요."
            className="w-full h-[400px] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md w-[116px] h-[40px]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#16125D] text-white hover:bg-blue-900 px-4 py-2 rounded-md w-[116px] h-[40px] disabled:bg-gray-400"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticePostEditPage;
