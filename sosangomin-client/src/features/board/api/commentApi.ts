import axios from "axios";
import { getUserInfo, getAccessToken } from "@/features/auth/api/userStorage";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

// 댓글 조회
export const fetchComments = async (boardId: string) => {
  try {
    const userInfo = getUserInfo();
    const userId = userInfo ? userInfo.userId : null;

    const response = await axios.get(`${BASE_URL}/api/comment/${boardId}`, {
      params: userId ? { userId } : {}
    });

    return response.data;
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    throw error;
  }
};

// ✅ 댓글 작성 API
export const addComment = async (boardId: string, content: string) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const response = await axios.post(
      `${BASE_URL}/api/comment/${boardId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (commentId: number, content: string) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    console.log(" 댓글 수정 요청 전송:", {
      commentId,
      content,
      token
    });

    const response = await axios.patch(
      `${BASE_URL}/api/comment/${commentId}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("댓글 수정 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("댓글 수정 실패:", error);

    if (error.response) {
      console.error("서버 응답:", error.response.data);
    }

    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId: number) => {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    console.log("댓글 삭제 요청 전송:", {
      commentId,
      token
    });

    const response = await axios.delete(
      `${BASE_URL}/api/comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("댓글 삭제 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("댓글 삭제 실패:", error);

    if (error.response) {
      console.error("서버 응답:", error.response.data);
    }

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
