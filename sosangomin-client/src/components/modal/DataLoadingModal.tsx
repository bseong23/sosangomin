import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFileModalStore from "@/store/modalStore";
import { quizData } from "./quizData";

interface DataLoadingModalProps {
  isOpen: boolean;
  fileCount: number;
  posType: string;
  isLoading: boolean;
  onLoadingComplete: () => void;
  analysisId?: string | null;
}

const DataLoadingModal: React.FC<DataLoadingModalProps> = ({
  isOpen,
  fileCount,
  posType,
  isLoading,
  onLoadingComplete,
  analysisId
}) => {
  // 라우팅을 위한 useNavigate 훅 사용
  const navigate = useNavigate();

  // Zustand 스토어에서 상태와 액션 가져오기
  const {
    gameActive,
    selectedQuizzes,
    currentQuizIndex,
    selectedOption,
    showAnswer,
    score,
    quizEnded,
    showCompletionNotice,
    analysisCompleted,
    closeModal,

    initGame,
    selectOption,
    nextQuiz,
    resetGame,
    setAnalysisCompleted,
    completeLoading
  } = useFileModalStore();

  // 이전 로딩 상태와 모달 상태를 기억하기 위한 ref
  const prevIsLoadingRef = useRef<boolean>(true);
  const prevIsOpenRef = useRef<boolean>(false);

  // 결과 페이지로 이동 여부를 트래킹하기 위한 상태
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // 모달을 닫고 리서치 페이지로 이동
  const handleViewResults = () => {
    // 네비게이션 플래그 설정
    setShouldNavigate(true);
    // 분석 완료 상태 설정
    setAnalysisCompleted(true);
    // 모달 닫기 콜백 호출
    onLoadingComplete();
    // 명시적으로 모달 상태 업데이트
    closeModal();
  };

  // 퀴즈 계속하기
  const handleContinueQuiz = () => {
    if (!gameActive) {
      initGame(quizData);
    }
    // Zustand 액션 사용
    completeLoading();
  };

  // 모달이 닫힐 때 네비게이션 수행
  useEffect(() => {
    // 이전에 열려있다가 닫힌 경우에만 네비게이션 실행
    if (
      prevIsOpenRef.current &&
      !isOpen &&
      (analysisCompleted || shouldNavigate)
    ) {
      // 리서치 페이지로 이동
      navigate("/data-analysis/research", {
        state: {
          analysisData: {
            posType: posType,
            fileCount: fileCount,
            timestamp: new Date().toISOString(),
            // 퀴즈 결과도 함께 전달
            quizResults: gameActive
              ? {
                  score: score,
                  totalQuestions: selectedQuizzes.length
                }
              : null,
            // 분석 ID가 있으면 함께 전달
            analysisId: analysisId
          }
        }
      });
      // 네비게이션 플래그 초기화
      setShouldNavigate(false);
    }

    // 이전 모달 상태 업데이트
    prevIsOpenRef.current = isOpen;
  }, [
    isOpen,
    analysisCompleted,
    shouldNavigate,
    navigate,
    posType,
    fileCount,
    gameActive,
    score,
    selectedQuizzes,
    analysisId
  ]);

  // 로딩 상태 변경 감지 및 자동 상태 업데이트
  useEffect(() => {
    // 이전에 로딩 중이었고 현재 로딩이 완료되었을 때
    if (prevIsLoadingRef.current && !isLoading) {
      console.log("로딩 상태 변경 감지: 로딩 완료됨");
      // 로딩 완료 알림 표시 - Zustand 액션 사용
      completeLoading();

      // 로딩이 끝난 후에도 분석 완료 상태가 설정되지 않았다면 여기서 설정
      if (!analysisCompleted) {
        console.log("분석 완료 상태 설정");
        setAnalysisCompleted(true);
      }
    }

    // 이전 로딩 상태 업데이트
    prevIsLoadingRef.current = isLoading;
  }, [isLoading, completeLoading, analysisCompleted, setAnalysisCompleted]);

  // 옵션 선택 처리
  const handleOptionSelect = (optionIndex: number) => {
    // Zustand 액션 사용
    selectOption(optionIndex);
  };

  // 다음 문제로 넘어가기
  const handleNextQuiz = () => {
    // Zustand 액션 사용
    nextQuiz();
  };

  // 모달이 닫힐 때 게임 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      // Zustand 액션 사용
      resetGame();
    }
  }, [isOpen, resetGame]);

  // 퀴즈 게임 초기화
  useEffect(() => {
    if (gameActive && selectedQuizzes.length === 0) {
      // Zustand 액션 사용
      initGame(quizData);
    }
  }, [gameActive, selectedQuizzes.length, initGame]);

  // 분석 완료 상태 변경 감지
  useEffect(() => {
    if (analysisCompleted && isOpen && !isLoading) {
      console.log("분석 완료 상태 변경됨, UI 업데이트");
      // 명시적으로 로딩 완료 상태 설정
      completeLoading();
    }
  }, [analysisCompleted, isOpen, isLoading, completeLoading]);

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    if (!isLoading) {
      // 분석이 완료된 상태인지 확인하고, 아니라면 설정
      if (!analysisCompleted) {
        setAnalysisCompleted(true);
      }

      // 모달 닫기 콜백 호출
      onLoadingComplete();

      // 명시적으로 모달 닫기 상태 설정
      closeModal();
    }
  };

  if (!isOpen) return null;

  // 디버깅 정보 - 개발용
  console.log("모달 상태:", {
    isOpen,
    isLoading,
    analysisCompleted,
    showCompletionNotice
  });

  // 분석 완료 시 메인 화면 (퀴즈 없이)
  const renderCompletionScreen = () => {
    // analysisCompleted 상태가 우선 (더 신뢰할 수 있는 상태)
    if (
      (!isLoading && analysisCompleted) ||
      (!isLoading && showCompletionNotice && !gameActive)
    ) {
      return (
        <div className="text-center p-5">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-4">
            데이터 분석이 완료되었습니다!
          </h3>

          <div className="flex gap-3">
            <button
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-medium"
              onClick={handleViewResults}
            >
              결과 보기
            </button>
            <button
              className="flex-1 bg-bit-main text-white py-3 px-4 rounded-md hover:bg-blue-900 transition-colors font-medium"
              onClick={handleContinueQuiz}
            >
              퀴즈 풀어보기
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden relative">
        {/* 닫기 버튼 - 로딩 중에는 비활성화 */}
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          disabled={isLoading}
          aria-label="창 닫기"
        >
          ✕
        </button>

        {/* 메인 콘텐츠 */}
        {renderCompletionScreen() || (
          <>
            {/* 상단 상태 표시 */}
            <div
              className={`p-3 text-center ${
                !isLoading && (analysisCompleted || showCompletionNotice)
                  ? "bg-green-100"
                  : "bg-blue-50"
              }`}
            >
              {!isLoading && (analysisCompleted || showCompletionNotice) ? (
                <p className="text-green-800 font-medium">
                  데이터 분석이 완료되었습니다!
                </p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-bit-main"></div>
                  <p className="text-bit-main font-medium">데이터 분석 중...</p>
                </div>
              )}
            </div>

            {/* 로딩 중이고 퀴즈가 시작되지 않았을 때 */}
            {isLoading && !gameActive && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-700 mb-3">
                  {fileCount}개의 {posType} 영수증 파일을 분석하고 있습니다.
                </p>

                <button
                  onClick={() => initGame(quizData)}
                  className="bg-bit-main text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors mt-2"
                >
                  기다리는 동안 퀴즈 풀기
                </button>
              </div>
            )}

            {/* 분석 완료되었지만 아직 퀴즈가 진행 중이지 않을 때 */}
            {!isLoading &&
              (analysisCompleted || showCompletionNotice) &&
              !gameActive && (
                <div className="p-4 text-center">
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handleViewResults}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors mr-2"
                    >
                      결과 보기
                    </button>
                    <button
                      onClick={handleContinueQuiz}
                      className="flex-1 bg-bit-main text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ml-2"
                    >
                      퀴즈 풀어보기
                    </button>
                  </div>
                </div>
              )}

            {/* 퀴즈 섹션 */}
            {gameActive && (
              <div className="p-4">
                {/* 퀴즈 완료 결과 화면 */}
                {quizEnded ? (
                  <div className="text-center">
                    <h4 className="text-lg font-medium mb-3">소상공인 퀴즈</h4>

                    <h5 className="text-base mb-2">퀴즈 결과</h5>
                    <p className="mb-3">
                      총 {selectedQuizzes.length}문제 중{" "}
                      <span className="font-bold text-bit-main">
                        {score}문제
                      </span>
                      를 맞추셨습니다!
                    </p>

                    {score === selectedQuizzes.length ? (
                      <p className="text-green-600 font-medium mb-3">
                        🎉 완벽합니다! 모든 문제를 맞추셨습니다!
                      </p>
                    ) : score >= selectedQuizzes.length * 0.7 ? (
                      <p className="text-green-600 font-medium mb-3">
                        👏 잘 하셨습니다! 소상공인 지식이 풍부하시네요!
                      </p>
                    ) : score >= selectedQuizzes.length * 0.5 ? (
                      <p className="text-blue-600 font-medium mb-3">
                        👍 좋은 성적입니다! 조금만 더 공부해보세요!
                      </p>
                    ) : (
                      <p className="text-yellow-600 font-medium mb-3">
                        📚 소상공인 지식을 더 쌓아보세요!
                      </p>
                    )}

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => initGame(quizData)}
                        className="flex-1 bg-indigo-900 text-white py-2 px-4 rounded-md hover:bg-indigo-800 transition-colors"
                      >
                        다시 도전하기
                      </button>

                      {!isLoading &&
                        (analysisCompleted || showCompletionNotice) && (
                          <button
                            onClick={handleViewResults}
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                          >
                            분석 결과 보기
                          </button>
                        )}
                    </div>
                  </div>
                ) : (
                  // 퀴즈 진행 화면
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">
                        문제 {currentQuizIndex + 1} / {selectedQuizzes.length}
                      </span>
                      <span className="text-xs text-gray-500">
                        점수: {score}
                      </span>
                    </div>

                    <h5 className="font-medium text-center mb-4">
                      {selectedQuizzes[currentQuizIndex].question}
                    </h5>

                    <div className="space-y-2 mb-4">
                      {selectedQuizzes[currentQuizIndex].options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showAnswer}
                            className={`w-full py-2.5 px-3 text-left rounded-md border ${
                              selectedOption === index
                                ? index ===
                                  selectedQuizzes[currentQuizIndex]
                                    .correctAnswer
                                  ? "bg-green-100 border-green-300 text-green-800"
                                  : "bg-red-100 border-red-300 text-red-800"
                                : showAnswer &&
                                  index ===
                                    selectedQuizzes[currentQuizIndex]
                                      .correctAnswer
                                ? "bg-green-100 border-green-300 text-green-800"
                                : "bg-white border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>

                    {showAnswer && (
                      <div>
                        <div
                          className={`p-3 rounded-md mb-4 ${
                            selectedOption ===
                            selectedQuizzes[currentQuizIndex].correctAnswer
                              ? "bg-green-50 text-green-800"
                              : "bg-red-50 text-red-800"
                          }`}
                        >
                          <p className="font-medium mb-1">
                            {selectedOption ===
                            selectedQuizzes[currentQuizIndex].correctAnswer
                              ? "정답입니다! 👍"
                              : `오답입니다. 정답은 "${
                                  selectedQuizzes[currentQuizIndex].options[
                                    selectedQuizzes[currentQuizIndex]
                                      .correctAnswer
                                  ]
                                }" 입니다.`}
                          </p>
                          <p className="text-xs">
                            {selectedQuizzes[currentQuizIndex].explanation}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleNextQuiz}
                            className="flex-1 bg-bit-main text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                          >
                            {currentQuizIndex < selectedQuizzes.length - 1
                              ? "다음 문제"
                              : "결과 보기"}
                          </button>

                          {!isLoading &&
                            (analysisCompleted || showCompletionNotice) && (
                              <button
                                onClick={handleViewResults}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                              >
                                결과 보기
                              </button>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataLoadingModal;
