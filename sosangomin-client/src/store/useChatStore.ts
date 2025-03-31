import { create } from "zustand";
import { persist } from "zustand/middleware";
import { sendChatMessage } from "@/api/chatApi";
import { ChatRequest, ChatState } from "@/types/chatbot";

const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      sessionId: null,
      isLoading: false,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message]
        })),

      clearMessages: () => set({ messages: [], sessionId: null }),

      setSessionId: (sessionId) => set({ sessionId }),

      setIsLoading: (isLoading) => set({ isLoading }),

      sendMessage: async (userId, messageText) => {
        if (!userId || !messageText.trim()) return;

        // 사용자 메시지 추가
        get().addMessage({ text: messageText, isBot: false });
        set({ isLoading: true });

        try {
          // API 요청
          const request: ChatRequest = {
            user_id: userId,
            message: messageText,
            session_id: get().sessionId || null
          };

          const response = await sendChatMessage(request);

          // 세션 ID 업데이트
          if (response.session_id) {
            set({ sessionId: response.session_id });
          }

          // 봇 응답 추가
          get().addMessage({ text: response.bot_message, isBot: true });
        } catch (error) {
          console.error("채팅 오류:", error);
          get().addMessage({
            text: "채팅 처리 중 오류가 발생했습니다.",
            isBot: true
          });
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: "chat-storage", // 로컬 스토리지에 저장될 키 이름
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId
      }) // 저장할 상태 지정
    }
  )
);

export default useChatStore;
