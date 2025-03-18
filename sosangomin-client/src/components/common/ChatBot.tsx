import React, { useState } from "react";
import { sendChatMessage } from "@/api/chatApi";
import { ChatRequest, ChatResponse } from "@/types/chat";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isBot: boolean }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId] = useState(1); // 실제 사용 시 인증 정보에서 가져오세요

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = inputMessage;
    setInputMessage("");

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { text: newMessage, isBot: false }]);

    // API 요청
    const request: ChatRequest = {
      user_id: userId,
      message: newMessage,
      session_id: sessionId
    };

    try {
      const response: ChatResponse = await sendChatMessage(request);

      // 세션 ID 업데이트
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // 봇 응답 추가
      setMessages((prev) => [
        ...prev,
        { text: response.bot_message, isBot: true }
      ]);
    } catch (error) {
      console.error("채팅 오류:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "채팅 처리 중 오류가 발생했습니다.",
          isBot: true
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden w-[90vw] max-w-[400px] h-[60vh] max-h-[500px] absolute bottom-[5rem] right-0">
          <div className="bg-white p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-navy-500 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span className="font-semibold text-xl">고미니</span>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-bit-main mb-6 shadow-lg"></div>
              <p className="text-gray-500 mb-1">물어보고 싶은 질문을</p>
              <p className="text-gray-500 mb-8">고미니에게 물어보세요</p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="flex-1 p-4 overflow-y-auto max-h-80">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-2xl ${
                    msg.isBot
                      ? "bg-gray-100 self-start mr-12"
                      : "bg-indigo-900 text-white self-end ml-12"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          <div className="p-4">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 p-3 outline-none text-gray-700 bg-transparent"
                placeholder="질문을 입력하세요..."
              />
              <button
                onClick={() => handleSendMessage()}
                className="text-indigo-900 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-indigo-900 text-white p-4 rounded-full shadow-lg hover:bg-indigo-800 w-14 h-14 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* isOpen 상태에 따라 채팅창이 열려있을 때는 X 모양 닫기 아이콘, 닫혀있을 때는 말풍선 모양 채팅 아이콘을 표시 */}
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12"></path>
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          )}
        </svg>
      </button>
    </div>
  );
};

export default ChatBot;
