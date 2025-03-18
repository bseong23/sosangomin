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
      {/* 토글 버튼 */}
      <button
        onClick={toggleChat}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* 채팅 창 */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-xl mt-2 flex flex-col">
          {/* 채팅 내용 */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  msg.isBot
                    ? "bg-gray-100 self-start"
                    : "bg-blue-500 text-white self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* 입력 영역 */}
          <div className="border-t p-4 flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border rounded-l-lg p-2"
              placeholder="메시지 입력..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
