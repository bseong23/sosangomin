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
  const navigate = useNavigate();
  const [showQuitConfirmModal, setShowQuitConfirmModal] = useState(false);

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

  const prevIsLoadingRef = useRef<boolean>(true);
  const prevIsOpenRef = useRef<boolean>(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleViewResults = () => {
    setShouldNavigate(true);
    setAnalysisCompleted(true);
    onLoadingComplete();
    closeModal();
  };

  const handleContinueQuiz = () => {
    if (!gameActive) {
      initGame(quizData);
    }
    completeLoading();
  };

  // 퀴즈 중단 확인 모달 컴포넌트
  const QuitConfirmModal = () => {
    const handleContinueQuiz = () => {
      setShowQuitConfirmModal(false);
    };

    const handleQuitQuiz = () => {
      setShouldNavigate(true);
      setAnalysisCompleted(true);
      onLoadingComplete();
      closeModal();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-medium mb-4">퀴즈를 그만두시겠습니까?</h3>
          <p className="mb-4">
            현재까지 획득한 점수 {score}점으로 결과 페이지로 이동합니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleContinueQuiz}
              className="flex-1 bg-gray-200 text-black py-2 px-4 rounded-md"
            >
              계속 풀기
            </button>
            <button
              onClick={handleQuitQuiz}
              className="flex-1 bg-bit-main text-white py-2 px-4 rounded-md"
            >
              그만두기
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (
      prevIsOpenRef.current &&
      !isOpen &&
      (analysisCompleted || shouldNavigate)
    ) {
      navigate("/data-analysis/research", {
        state: {
          analysisData: {
            posType: posType,
            fileCount: fileCount,
            timestamp: new Date().toISOString(),
            quizResults: gameActive
              ? {
                  score: score,
                  totalQuestions: selectedQuizzes.length
                }
              : null,
            analysisId: analysisId
          }
        }
      });
      setShouldNavigate(false);
    }

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

  useEffect(() => {
    if (prevIsLoadingRef.current && !isLoading) {
      console.log("로딩 상태 변경 감지: 로딩 완료됨");
      completeLoading();

      if (!analysisCompleted) {
        console.log("분석 완료 상태 설정");
        setAnalysisCompleted(true);
      }
    }

    prevIsLoadingRef.current = isLoading;
  }, [isLoading, completeLoading, analysisCompleted, setAnalysisCompleted]);

  const handleOptionSelect = (optionIndex: number) => {
    selectOption(optionIndex);
  };

  const handleNextQuiz = () => {
    nextQuiz();
  };

  const handleCloseModal = () => {
    if (gameActive) {
      setShowQuitConfirmModal(true);
    } else {
      if (!analysisCompleted) {
        setAnalysisCompleted(true);
      }
      onLoadingComplete();
      closeModal();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetGame();
    }
  }, [isOpen, resetGame]);

  useEffect(() => {
    if (gameActive && selectedQuizzes.length === 0) {
      initGame(quizData);
    }
  }, [gameActive, selectedQuizzes.length, initGame]);

  useEffect(() => {
    if (analysisCompleted && isOpen && !isLoading) {
      console.log("분석 완료 상태 변경됨, UI 업데이트");
      completeLoading();
    }
  }, [analysisCompleted, isOpen, isLoading, completeLoading]);

  if (!isOpen) return null;

  console.log("모달 상태:", {
    isOpen,
    isLoading,
    analysisCompleted,
    showCompletionNotice
  });

  const renderCompletionScreen = () => {
    // gameActive가 false일 때만 렌더링
    if (
      !gameActive &&
      ((!isLoading && analysisCompleted) ||
        (!isLoading && showCompletionNotice))
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
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          disabled={isLoading}
          aria-label="창 닫기"
        >
          ✕
        </button>

        {showQuitConfirmModal && <QuitConfirmModal />}

        {renderCompletionScreen() || (
          <>
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

            {gameActive && (
              <div className="p-4">
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

                          {/* 분석 완료 상태일 때 추가 버튼들 */}
                          {!isLoading &&
                            (analysisCompleted || showCompletionNotice) && (
                              <div className="flex gap-3 w-full">
                                <button
                                  onClick={handleViewResults}
                                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                                >
                                  결과 보기
                                </button>
                                <button
                                  onClick={handleContinueQuiz}
                                  className="flex-1 bg-bit-main text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  퀴즈 계속하기
                                </button>
                              </div>
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
