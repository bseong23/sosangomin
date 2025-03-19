import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export const addComment = async (boardId: string, content: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/community/board/${boardId}/comments`,
      {
        content
      }
    );
    return response.data;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw error;
  }
};

export const updateComment = async (
  boardId: string,
  commentId: number,
  content: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/community/board/${boardId}/comments/${commentId}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};

export const deleteComment = async (boardId: string, commentId: number) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/community/board/${boardId}/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
};

export const addReply = async (
  boardId: string,
  commentId: number,
  content: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/community/board/${boardId}/comments/${commentId}/replies`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("대댓글 작성 실패:", error);
    throw error;
  }
};

export const updateReply = async (
  boardId: string,
  commentId: number,
  replyId: number,
  content: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/community/board/${boardId}/comments/${commentId}/replies/${replyId}`,
      { content }
    );
    return response.data;
  } catch (error) {
    console.error("대댓글 수정 실패:", error);
    throw error;
  }
};

export const deleteReply = async (
  boardId: string,
  commentId: number,
  replyId: number
) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/community/board/${boardId}/comments/${commentId}/replies/${replyId}`
    );
    return response.data;
  } catch (error) {
    console.error("대댓글 삭제 실패:", error);
    throw error;
  }
};
