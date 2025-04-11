import React, { useState, useEffect, useRef } from "react";
import chatbot from "@/assets/chatbot.png";
import useAuthStore from "@/store/useAuthStore";
import useChatStore from "@/store/useChatStore";

const ChatBot: React.FC = () => {
  const { userInfo } = useAuthStore();
  const userId = userInfo?.userId || null;

  // Zustand 챗봇 스토어 사용
  const { messages, isLoading, sendMessage } = useChatStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const toggleChat = () => {
    if (!userId) {
      alert("로그인 후 이용해 주세요");
      return;
    }
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    // 챗봇이 열리면 배경 스크롤 방지, 닫히면 스크롤 복원
    if (newIsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      setInputMessage("");
      document.body.style.overflow = "";
    }
  };

  // 메시지 추가 시 하단으로 자동 스크롤
  useEffect(() => {
    if (chatContentRef.current && messages.length > 0) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  // 챗봇을 열거나 닫을 때도 스크롤 위치 유지
  useEffect(() => {
    if (isOpen && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [isOpen]);

  // 외부 클릭 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // 챗봇 창이 열려있고, 클릭 타겟이 챗봇 창 외부이고, 토글 버튼도 아닐 때만 닫기
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
        // 외부 클릭으로 닫을 때도 스크롤 복원
        setInputMessage("");
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // 3초마다 플립 애니메이션 실행
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, 3000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);

  // 컴포넌트 언마운트 시 body 스타일 복원
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // 챗봇 창이 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // textarea 높이 자동 조절
  useEffect(() => {
    const adjustHeight = () => {
      const textarea = inputRef.current;
      if (!textarea) return;

      // 높이 초기화
      textarea.style.height = "auto";

      // 스크롤 높이에 맞게 조정 (최대 높이 제한은 CSS에서 처리)
      const newHeight = Math.min(textarea.scrollHeight, 80); // 최대 80px
      textarea.style.height = `${newHeight}px`;
    };

    // 입력값 변경 시 높이 조절
    adjustHeight();
  }, [inputMessage]);

  const handleSendMessage = async () => {
    // 이미 로딩 중이거나 메시지가 비어있으면 처리하지 않음
    if (isLoading || !inputMessage.trim()) return;

    if (!userId) {
      alert("로그인 후 이용해주세요");
      return;
    }

    const newMessage = inputMessage;
    setInputMessage("");

    // Zustand 스토어의 sendMessage 함수 사용
    await sendMessage(userId, newMessage);

    // 전송 후 입력 필드에 포커스
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const closeChat = () => {
    setIsOpen(false);
    // 챗봇 닫을 때 배경 스크롤 복원
    setInputMessage("");
    document.body.style.overflow = "";
  };

  // 챗봇 확장/축소 토글 함수
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);

    // 크기 변경 후 스크롤 위치 조정
    setTimeout(() => {
      if (chatContentRef.current) {
        chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
      }
    }, 50);
  };

  return (
    <div className="fixed bottom-6 right-4 md:bottom-6 md:right-6 lg:bottom-6 lg:right-8 z-50">
      {isOpen && (
        <div
          ref={chatRef}
          className={`bg-white rounded-2xl shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden w-[90vw] ${
            isExpanded
              ? "max-w-[800px] h-[80vh] max-h-[700px]"
              : "max-w-[400px] h-[70vh] max-h-[500px]"
          } absolute bottom-[6rem] right-0 transition-all duration-300`}
        >
          <div className="bg-white p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-navy-500 mr-2"></div>
              <span className="font-semibold text-lg">고미니</span>
            </div>
            <div className="flex items-center">
              {/* 확장/축소 버튼 추가 */}
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-gray-700 mr-2"
                aria-label={isExpanded ? "축소하기" : "확장하기"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {isExpanded ? (
                    // 축소 아이콘
                    <>
                      <polyline points="4 14 10 14 10 20"></polyline>
                      <polyline points="20 10 14 10 14 4"></polyline>
                      <line x1="14" y1="10" x2="21" y2="3"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </>
                  ) : (
                    // 확장 아이콘
                    <>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </>
                  )}
                </svg>
              </button>

              {/* X 버튼 추가 */}
              <button
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
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
            <div
              ref={chatContentRef}
              className="flex-1 p-3 md:p-4 overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <div key={index} className="w-full flex mb-3">
                  {msg.isBot && (
                    <img
                      src={chatbot}
                      alt="chatbot"
                      className="w-15 h-15 mr-2 rounded-full self-start"
                    />
                  )}
                  <div
                    className={`p-3 rounded-2xl text-sm break-words overflow-hidden max-w-[80%] ${
                      msg.isBot
                        ? "bg-gray-100 mr-auto"
                        : "bg-indigo-900 text-white ml-auto"
                    }`}
                    style={{
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap" // 줄바꿈 유지
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* 로딩 표시 */}
              {isLoading && (
                <div className="flex items-center self-start mb-3 p-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="p-4">
            <div className="border border-gray-200 rounded-full overflow-hidden">
              <div className="flex items-center w-full">
                <div className="flex-grow">
                  <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter 키만 눌렀을 때 메시지 전송
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // 기본 줄바꿈 동작 방지
                        handleSendMessage();
                      }
                    }}
                    className="w-full px-4 outline-none text-gray-700 bg-transparent resize-none max-h-22 min-h-[45px]"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      lineHeight: "25px" // 높이에 맞게 조정
                    }}
                    placeholder="질문을 입력하세요..."
                    disabled={isLoading} // 로딩 중 입력 비활성화
                    rows={1}
                  />
                </div>
                <div className="w-12 flex-none">
                  <button
                    onClick={handleSendMessage}
                    className={`text-indigo-900 p-2 w-full h-full flex items-center justify-center ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`} // 로딩 중 버튼 비활성화
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
        ref={buttonRef}
        onClick={toggleChat}
        className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex bg-gray-50 border border-gray-200 shadow-3xl rounded-full shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] items-center justify-center overflow-hidden cursor-pointer"
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
              <img src={chatbot} alt="chatbot" className="w-[100%]" />
            </div>

            {/* 뒷면 (텍스트) */}
            <div className="absolute w-full h-full flex items-center justify-center backface-hidden rotate-x-180">
              <span className="text-bit-main text-xl font-bold">챗봇</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ChatBot;
