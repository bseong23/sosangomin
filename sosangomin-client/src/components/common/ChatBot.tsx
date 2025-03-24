import React, { useState, useEffect } from "react";
import { sendChatMessage } from "@/api/chatApi";
import { ChatRequest, ChatResponse } from "@/types/chat";
import chatbot from "@/assets/chatbot.png";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; isBot: boolean }>
  >([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId] = useState(1); // 실제 사용 시 인증 정보에서 가져오세요
  // const [showImage, setShowImage] = useState(true);
  // const [animating, setAnimating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    // 3초마다 플립 애니메이션 실행
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

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
    <div className="fixed bottom-6 right-4  md:bottom-6 md:right-6 lg:bottom-6 lg:right-8  z-50">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden w-[90vw] max-w-[400px] h-[70vh] max-h-[500px] absolute bottom-[7rem] right-0">
          <div className="bg-white p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-navy-500 mr-2"></div>
              <span className="font-semibold text-lg">고미니</span>
            </div>
          </div>

          {messages.length === 0 && (
            <div className="flex flex-col flex-grow items-center justify-center p-6 md:p-8 lg:p-10 text-center">
              <img
                src={chatbot}
                alt="chatbot"
                className="w-24 md:w-28 lg:w-36 opacity-60"
              />
              <p className="text-gray-500 mb-1">물어보고 싶은 질문을</p>
              <p className="text-gray-500 mb-8">고미니에게 물어보세요!</p>
            </div>
          )}

          {messages.length > 0 && (
            <div className="flex-1 p-3 md:p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-2xl text-sm ${
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

          {/* <div className="p-4">
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
          </div> */}
          <div className="p-4">
            <div className="border border-gray-200 rounded-full overflow-hidden">
              <div className="flex items-center w-full">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="w-full p-3 outline-none text-gray-700 bg-transparent"
                    placeholder="질문을 입력하세요..."
                  />
                </div>
                <div className="w-12 flex-none">
                  <button
                    onClick={() => handleSendMessage()}
                    className="text-indigo-900 p-2 w-full h-full flex items-center justify-center"
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
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 flex bg-bit-main border border-gray-200 shadow-3xl rounded-full shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] items-center justify-center overflow-hidden cursor-pointer"
      >
        {/* 내용물 컨테이너 (perspective 적용) */}
        <div className="perspective-500 w-22 h-22 flex items-center justify-center">
          {/* 3D 변환을 적용할 중간 컨테이너 */}
          <div
            className={`
              w-full h-full flex items-center justify-center
              transform-style-3d duration-900
              ${isFlipped ? "rotate-x-180" : ""}
            `}
          >
            {/* 앞면 (이미지) */}
            <div className="absolute w-full h-full flex items-center justify-center backface-hidden">
              <img src={chatbot} alt="chatbot" className="w-[80%]" />
            </div>

            {/* 뒷면 (텍스트) */}
            <div className="absolute w-full h-full flex items-center justify-center backface-hidden rotate-x-180">
              <span className="text-white text-xl font-bold">챗봇</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ChatBot;
