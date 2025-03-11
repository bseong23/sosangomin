// src/components/comments/CommentForm.tsx

import React, { useState } from "react";
import { CommentFormProps } from "@/types/board";

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "댓글을 작성하세요.",
  buttonText = "댓글작성",
  minHeight = "min-h-[100px]"
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder={placeholder}
        className={`w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 ${minHeight}`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="bg-[#16125D] text-white hover:bg-blue-900 px-4 py-2 rounded-md"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
