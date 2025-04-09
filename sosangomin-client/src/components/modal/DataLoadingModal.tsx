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
  hasError?: boolean; // 에러 상태 추가
  errorMessage?: string; // 에러 메시지 추가
}

const DataLoadingModal: React.FC<DataLoadingModalProps> = ({
  isOpen,
  fileCount,
  posType,
  isLoading,
  onLoadingComplete,
  analysisId,
  hasError = false
  // errorMessage = "데이터 분석 중 오류가 발생했습니다."
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

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // 진행도를 증가시키되 최대 90%까지만
          return prevProgress < 90
            ? prevProgress + 5
            : prevProgress === 100
            ? 10
            : prevProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(100); // 로딩 완료 시 100%
    }
  }, [isLoading]);

  const handleErrorClose = () => {
    // 단순히 모달만 닫고 navigate은 트리거하지 않음
    closeModal();
    // 추가로 shouldNavigate와 analysisCompleted 상태를 false로 설정
    setShouldNavigate(false);
    setAnalysisCompleted(false);
  };

  // DataLoadingModal.tsx의 handleViewResults 함수 수정
  const handleViewResults = () => {
    // 이미 완료 처리된 경우 중복 처리 방지
    if (analysisCompleted) {
      closeModal(); // 모달만 닫기
      return;
    }

    setShouldNavigate(true);
    setAnalysisCompleted(true);
    onLoadingComplete(); // 이 함수가 중복 요청을 발생시킬 수 있음
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
        <div className="bg-white rounded-lg p-6 text-center shadow-xl max-w-md mx-auto">
          <h3 className="text-xl font-medium mb-4">퀴즈를 그만두시겠습니까?</h3>
          <p className="mb-4">
            현재까지 획득한 점수{" "}
            <span className="font-bold text-blue-700">{score}점</span>으로 결과
            페이지로 이동합니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleContinueQuiz}
              className="flex-1 bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              계속 풀기
            </button>
            <button
              onClick={handleQuitQuiz}
              className="flex-1 bg-bit-main text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
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
      completeLoading();

      if (!analysisCompleted) {
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
      completeLoading();
    }
  }, [analysisCompleted, isOpen, isLoading, completeLoading]);

  if (!isOpen) return null;

  const renderCompletionScreen = () => {
    // 에러가 있는 경우 에러 화면 표시
    if (hasError) {
      return (
        <div className="text-center p-5">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-6">
            잘못된 데이터 형식입니다.
          </h3>

          <button
            className="bg-bit-main text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2 mx-auto"
            onClick={handleErrorClose}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            돌아가기
          </button>
        </div>
      );
    }

    // 게임활성화 상태가 아닐 때만 렌더링 (성공 화면)
    if (
      !gameActive &&
      ((!isLoading && analysisCompleted) ||
        (!isLoading && showCompletionNotice))
    ) {
      return (
        <div className="text-center p-5">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-500"
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
          </div>

          <h3 className="text-xl font-medium text-gray-800 mb-6">
            데이터 분석이 완료되었습니다!
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
              onClick={handleViewResults}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              결과 보기
            </button>
            <button
              className="bg-bit-main text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
              onClick={handleContinueQuiz}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              퀴즈 풀어보기
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  // 모달 헤더 색상 및 텍스트 함수 추가
  const getModalHeaderClass = () => {
    if (hasError) {
      return "bg-gradient-to-r from-red-400 to-red-500";
    }
    if (!isLoading && (analysisCompleted || showCompletionNotice)) {
      return "bg-gradient-to-r from-green-400 to-green-500";
    }
    return "bg-gradient-to-r from-blue-400 to-blue-500";
  };

  const getModalHeaderText = () => {
    if (hasError) {
      return (
        <p className="text-white font-medium flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          데이터 분석 오류 발생
        </p>
      );
    }
    if (!isLoading && (analysisCompleted || showCompletionNotice)) {
      return (
        <p className="text-white font-medium flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
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
          데이터 분석이 완료되었습니다!
        </p>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        <p className="text-white font-medium">데이터 분석 중...</p>
      </div>
    );
  };

  // return 부분 전체 코드
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden relative">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          disabled={isLoading}
          aria-label="창 닫기"
        >
          ✕
        </button>

        {showQuitConfirmModal && <QuitConfirmModal />}

        {renderCompletionScreen() || (
          <>
            <div className={`p-3 text-center ${getModalHeaderClass()}`}>
              {getModalHeaderText()}
            </div>
            {/* <div
              className={`p-3 text-center ${
                !isLoading && (analysisCompleted || showCompletionNotice)
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-blue-400 to-blue-500"
              }`}
            >
              {!isLoading && (analysisCompleted || showCompletionNotice) ? (
                <p className="text-white font-medium flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
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
                  데이터 분석이 완료되었습니다!
                </p>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <p className="text-white font-medium">데이터 분석 중...</p>
                </div>
              )}
            </div> */}

            {isLoading && !gameActive && (
              <div className="p-5 text-center">
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg
                      className="w-10 h-10 text-blue-500 animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-gray-700 mb-1 text-lg font-medium">
                    영수증 데이터 분석 중
                  </p>
                  <p className="text-gray-500 text-sm">
                    {fileCount}개의 {posType} 영수증 파일을 분석하고 있습니다.
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                  <div
                    className="bg-bit-main h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm mb-5 text-gray-600">
                  {progress === 100 ? "완료!" : `${progress}% 진행 중...`}
                </div>

                <button
                  onClick={() => initGame(quizData)}
                  className="w-full bg-bit-main text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
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
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mr-2 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        ></path>
                      </svg>
                      결과 보기
                    </button>
                    <button
                      onClick={handleContinueQuiz}
                      className="flex-1 bg-bit-main text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity ml-2 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      퀴즈 풀어보기
                    </button>
                  </div>
                </div>
              )}

            {gameActive && (
              <div className="p-5">
                {quizEnded ? (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
                      <svg
                        className="w-12 h-12 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        ></path>
                      </svg>
                    </div>

                    <h4 className="text-lg font-medium mb-1">소상공인 퀴즈</h4>
                    <h5 className="text-xl font-bold mb-3 text-blue-800">
                      퀴즈 결과
                    </h5>

                    <div className="bg-blue-50 rounded-lg p-4 mb-5">
                      <p className="mb-1">
                        총{" "}
                        <span className="font-bold">
                          {selectedQuizzes.length}문제
                        </span>{" "}
                        중{" "}
                        <span className="font-bold text-bit-main text-xl">
                          {score}문제
                        </span>
                        를 맞추셨습니다!
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2.5 my-3">
                        <div
                          className="bg-bit-main h-2.5 rounded-full"
                          style={{
                            width: `${(score / selectedQuizzes.length) * 100}%`
                          }}
                        ></div>
                      </div>

                      {score === selectedQuizzes.length ? (
                        <p className="text-green-600 font-medium">
                          🎉 완벽합니다! 모든 문제를 맞추셨습니다!
                        </p>
                      ) : score >= selectedQuizzes.length * 0.7 ? (
                        <p className="text-green-600 font-medium">
                          👏 잘 하셨습니다! 소상공인 지식이 풍부하시네요!
                        </p>
                      ) : score >= selectedQuizzes.length * 0.5 ? (
                        <p className="text-blue-600 font-medium">
                          👍 좋은 성적입니다! 조금만 더 공부해보세요!
                        </p>
                      ) : (
                        <p className="text-yellow-600 font-medium">
                          📚 소상공인 지식을 더 쌓아보세요!
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => initGame(quizData)}
                        className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        다시 도전하기
                      </button>

                      {!isLoading &&
                        (analysisCompleted || showCompletionNotice) && (
                          <button
                            onClick={handleViewResults}
                            className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              ></path>
                            </svg>
                            분석 결과 보기
                          </button>
                        )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                        문제 {currentQuizIndex + 1} / {selectedQuizzes.length}
                      </span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium">
                        점수: {score}
                      </span>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-5">
                      <h5 className="font-medium text-center text-blue-900 text-lg">
                        {selectedQuizzes[currentQuizIndex].question}
                      </h5>
                    </div>

                    <div className="space-y-3 mb-5">
                      {selectedQuizzes[currentQuizIndex].options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showAnswer}
                            className={`w-full py-3 px-4 text-left rounded-lg border-2 transition-all ${
                              selectedOption === index
                                ? index ===
                                  selectedQuizzes[currentQuizIndex]
                                    .correctAnswer
                                  ? "bg-green-50 border-green-400 text-green-800 shadow-md"
                                  : "bg-red-50 border-red-400 text-red-800 shadow-md"
                                : showAnswer &&
                                  index ===
                                    selectedQuizzes[currentQuizIndex]
                                      .correctAnswer
                                ? "bg-green-50 border-green-400 text-green-800 shadow-md"
                                : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center 
                              ${
                                selectedOption === index
                                  ? index ===
                                    selectedQuizzes[currentQuizIndex]
                                      .correctAnswer
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                  : showAnswer &&
                                    index ===
                                      selectedQuizzes[currentQuizIndex]
                                        .correctAnswer
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                              >
                                {String.fromCharCode(65 + index)}
                              </div>
                              {option}
                              {showAnswer &&
                                (index ===
                                selectedQuizzes[currentQuizIndex]
                                  .correctAnswer ? (
                                  <svg
                                    className="w-5 h-5 ml-auto text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    ></path>
                                  </svg>
                                ) : selectedOption === index ? (
                                  <svg
                                    className="w-5 h-5 ml-auto text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                  </svg>
                                ) : null)}
                            </div>
                          </button>
                        )
                      )}
                    </div>

                    {showAnswer && (
                      <div>
                        <div
                          className={`p-4 rounded-lg mb-5 ${
                            selectedOption ===
                            selectedQuizzes[currentQuizIndex].correctAnswer
                              ? "bg-green-50 border border-green-200 text-green-800"
                              : "bg-red-50 border border-red-200 text-red-800"
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`p-1 rounded-full ${
                                selectedOption ===
                                selectedQuizzes[currentQuizIndex].correctAnswer
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              } mr-3`}
                            >
                              {selectedOption ===
                              selectedQuizzes[currentQuizIndex]
                                .correctAnswer ? (
                                <svg
                                  className="w-5 h-5"
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
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                              )}
                            </div>
                            <div>
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
                              <p className="text-sm">
                                {selectedQuizzes[currentQuizIndex].explanation}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handleNextQuiz}
                            className="flex-1 bg-bit-main text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-medium"
                          >
                            {currentQuizIndex < selectedQuizzes.length - 1
                              ? "다음 문제"
                              : "결과 보기"}
                          </button>

                          {/* 분석 완료 상태일 때 추가 버튼들 */}
                          {!isLoading &&
                            (analysisCompleted || showCompletionNotice) && (
                              <button
                                onClick={handleViewResults}
                                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  ></path>
                                </svg>
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
