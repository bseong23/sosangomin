import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BoardPostEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const postData = location.state?.postData;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (postData) {
      setTitle(postData.title);
      setContent(postData.content);
      setIsLoading(false);
    } else {
      // 실제 API 연동 전 임시 데이터 로드 (나중에 API 연동으로 교체 예정)
      const loadMockData = () => {
        try {
          setIsLoading(true);
          // 임시 데이터 설정
          setTimeout(() => {
            setTitle("수정할 게시글 제목입니다");
            setContent(
              "수정할 게시글 내용입니다. 여기에 원래 내용이 표시됩니다."
            );
            setIsLoading(false);
          }); // 로딩 상태 시뮬레이션
        } catch (error) {
          console.error("데이터 로드 중 오류 발생", error);
          setIsLoading(false);
        }
      };

      loadMockData();
    }
  }, [postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 나중에 API 연동 코드로 교체될 부분
    console.log("수정 요청:", { postId, title, content });

    // 수정 후 상세 페이지로 이동 (임시)
    alert("게시글이 수정되었습니다.");
    navigate(`/community/board/post/${postId}`);
  };

  const handleCancel = () => {
    // 상세 페이지로 돌아감
    navigate(`/community/board/post/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[972px] mx-auto px-4 py-10 flex justify-center">
        <p>게시글을 불러오는 중...</p>
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
            placeholder="제목을 입력해 주세요."
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="w-full mb-6">
          <textarea
            placeholder="내용을 입력해 주세요."
            className="w-full h-[400px] p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            className="bg-[#16125D] text-white hover:bg-blue-900 px-4 py-2 rounded-md w-[116px] h-[40px]"
          >
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardPostEditPage;
