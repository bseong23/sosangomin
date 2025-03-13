import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WritePost: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 게시글 작성 API 연동 로직 추가
    console.log({ title, content });

    const newPostId = 1;
    navigate(`/community/board/post/${newPostId}`);
  };

  const handleCancel = () => {
    // 직전으로 돌아감
    navigate(-1);
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
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-bit-main text-basic-white hover:bg-blue-900 px-4 py-2 rounded-md w-[116px] h-[40px]"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
