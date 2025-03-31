import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataLoadingModalProps, Quiz } from "./types";
import LoadingScreen from "./LoadingScreen";
import CompletionScreen from "./CompletionScreen";
import QuizGame from "./QuizGame";
import useFileModalStore from "@/store/modalStore";

// TODO: 백엔드 API 연동 시 주석 해제
// import { useAnalysisPolling } from '@/features/analysis';

// 요식업 소상공인을 위한 퀴즈 목록
const quizzes: Quiz[] = [
  {
    question:
      "음식점의 평균 식재료 원가율은 일반적으로 매출의 얼마로 권장되나요?",
    options: ["15-20%", "20-35%", "40-50%", "50-60%"],
    correctAnswer: 1,
    explanation:
      "일반적으로 음식점의 식재료 원가율은 매출의 20-35% 정도가 적정선으로 여겨집니다. 업종과 메뉴에 따라 차이가 있을 수 있습니다."
  },
  // 기존 퀴즈 데이터 계속...
  {
    question:
      "요식업 창업시 권장되는 초기 운영 자금(인테리어, 임대료 등 제외)은 월 매출의 최소 몇 개월분?",
    options: ["1-2개월", "3-6개월", "7-9개월", "1년 이상"],
    correctAnswer: 1,
    explanation:
      "일반적으로 요식업 창업시 안정적인 운영을 위해 월 매출의 3-6개월분의 운영 자금을 확보하는 것이 권장됩니다. 이는 초기 불안정한 매출에 대비하기 위함입니다."
  }
];

const DataLoadingModal: React.FC<DataLoadingModalProps> = ({
  isOpen,
  fileCount,
  posType,
  isLoading,
  onLoadingComplete
}) => {
  // 라우팅을 위한 useNavigate 훅 사용
  const navigate = useNavigate();

  // zustand 스토어에서 상태와 액션 가져오기
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

    initGame,
    selectOption,
    nextQuiz,
    resetGame,
    setAnalysisCompleted,
    completeLoading
  } = useFileModalStore();

  // TODO: 백엔드 API 연동 시 주석 해제
  // // 폴링을 통한 분석 상태 확인
  // const [analysisId, setAnalysisId] = useState<string | null>(null);
  // const { analysisState, startPolling, stopPolling } = useAnalysisPolling(analysisId);

  // // 분석 ID가 설정되면 폴링 시작
  // useEffect(() => {
  //   if (analysisId) {
  //     startPolling();
  //   }
  //
  //   // 컴포넌트 언마운트 시 폴링 중지
  //   return () => {
  //     stopPolling();
  //   };
  // }, [analysisId, startPolling, stopPolling]);

  // // 폴링 결과 처리
  // useEffect(() => {
  //   // 분석이 완료된 경우
  //   if (analysisState.data && (analysisState.data.status === 'success' || analysisState.data.status === 'failed')) {
  //     // 로딩 상태 종료, 완료 화면 표시
  //     completeLoading();
  //
  //     // 상태 업데이트 (실패 처리도 필요하다면 추가)
  //     if (analysisState.data.status === 'success') {
  //       console.log("분석 완료:", analysisState.data);
  //     } else {
  //       console.error("분석 실패:", analysisState.error);
  //     }
  //   }
  // }, [analysisState, completeLoading]);

  // 이전 로딩 상태와 모달 상태를 기억하기 위한 ref
  const prevIsLoadingRef = useRef<boolean>(true);
  const prevIsOpenRef = useRef<boolean>(false);

  // 모달 참조 추가
  const modalRef = useRef<HTMLDivElement>(null);

  // 화면 크기 변경 이벤트 처리 추가
  useEffect(() => {
    const handleResize = () => {
      // 화면 크기 변경 시 상태 유지를 위한 코드
      console.log("윈도우 크기가 변경되었지만 모달과 파일 상태는 유지됩니다.");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 모달 닫기 및 리서치 페이지로 이동
  const handleViewResults = () => {
    // 부모 컴포넌트의 콜백 호출 (모달 닫기)
    onLoadingComplete();

    // 리서치 페이지로 네비게이션 상태 설정
    setAnalysisCompleted(true);

    // TODO: 백엔드 API 연동 시 주석 해제
    // // 분석 ID를 전달하여 결과 페이지로 이동
    // if (analysisState.data) {
    //   navigate("/data-analysis/research", {
    //     state: {
    //       analysisData: {
    //         analysisId: analysisState.data.analysis_id,
    //         posType: posType,
    //         fileCount: fileCount,
    //         timestamp: new Date().toISOString(),
    //         quizResults: gameActive
    //           ? {
    //               score: score,
    //               totalQuestions: selectedQuizzes.length
    //             }
    //           : null
    //       }
    //     }
    //   });
    // }
  };

  // 퀴즈 계속하기
  const handleContinueQuiz = () => {
    if (!gameActive) {
      // zustand의 initGame 액션 사용
      initGame(quizzes);
    }
    // useState 사용 대신 zustand 액션 필요 - completeLoading 호출
    completeLoading();
  };

  // 모달이 닫힐 때 네비게이션 수행
  useEffect(() => {
    // 이전에 열려있다가 닫힌 경우에만 네비게이션 실행
    if (prevIsOpenRef.current && !isOpen && analysisCompleted) {
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
              : null
            // TODO: 백엔드 API 연동 시 주석 해제
            // // 분석 ID가 있으면 함께 전달
            // analysisId: analysisState.data?.analysis_id
          }
        }
      });
    }

    // 이전 모달 상태 업데이트
    prevIsOpenRef.current = isOpen;
  }, [
    isOpen,
    analysisCompleted,
    navigate,
    posType,
    fileCount,
    gameActive,
    score,
    selectedQuizzes
  ]);

  // 로딩 상태 변경 감지
  useEffect(() => {
    // 이전에 로딩 중이었고 현재 로딩이 완료되었을 때
    if (prevIsLoadingRef.current && !isLoading) {
      // 로딩 완료 알림 표시 - useState 대신 zustand 액션 사용
      completeLoading();
    }

    // 이전 로딩 상태 업데이트
    prevIsLoadingRef.current = isLoading;
  }, [isLoading, completeLoading]);

  // 옵션 선택 처리
  const handleOptionSelect = (optionIndex: number) => {
    // zustand의 selectOption 액션 사용
    selectOption(optionIndex);
  };

  // 다음 문제로 넘어가기
  const handleNextQuiz = () => {
    // zustand의 nextQuiz 액션 사용
    nextQuiz();
  };

  // 모달이 닫힐 때 게임 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      // zustand의 resetGame 액션 사용
      resetGame();
    }
  }, [isOpen, resetGame]);

  // 퀴즈 게임 초기화
  useEffect(() => {
    if (gameActive && selectedQuizzes.length === 0) {
      // zustand의 initGame 액션 사용
      initGame(quizzes);
    }
  }, [gameActive, selectedQuizzes.length, initGame]);

  // 모달 외부 클릭 시 닫기 처리 (단, 로딩 중이 아닐 때만)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !isLoading
      ) {
        onLoadingComplete();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLoading, onLoadingComplete]);

  if (!isOpen) return null;

  // 컴포넌트 렌더링 결정
  const renderContent = () => {
    // 분석 완료되고 퀴즈 시작하지 않은 경우
    if (!isLoading && showCompletionNotice && !gameActive) {
      return (
        <CompletionScreen
          onViewResults={handleViewResults}
          onStartQuiz={handleContinueQuiz}
        />
      );
    }

    // 로딩 중이고 퀴즈 시작하지 않은 경우
    if (isLoading && !gameActive) {
      return (
        <LoadingScreen
          fileCount={fileCount}
          posType={posType}
          onStartQuiz={() => initGame(quizzes)}
        />
      );
    }

    // 퀴즈 게임 진행 중
    if (gameActive) {
      return (
        <QuizGame
          quizzes={selectedQuizzes}
          score={score}
          currentIndex={currentQuizIndex}
          selectedOption={selectedOption}
          showAnswer={showAnswer}
          isQuizEnded={quizEnded}
          isLoading={isLoading}
          onOptionSelect={handleOptionSelect}
          onNextQuiz={handleNextQuiz}
          onRestartQuiz={() => initGame(quizzes)}
          onViewResults={handleViewResults}
        />
      );
    }

    // 기본 화면 (로딩 중)
    return (
      <LoadingScreen
        fileCount={fileCount}
        posType={posType}
        onStartQuiz={() => initGame(quizzes)}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={modalRef}
        className="bg-white rounded-md shadow-xl w-full max-w-md mx-4 relative"
      >
        {/* 닫기 버튼 - 더 잘 보이도록 수정 */}
        <button
          onClick={() => {
            if (!isLoading) {
              onLoadingComplete();
            }
          }}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-gray-500 hover:bg-gray-100"
          disabled={isLoading}
          aria-label="창 닫기"
        >
          ✕
        </button>

        {/* 메인 콘텐츠 */}
        {renderContent()}
      </div>
    </div>
  );
};

export default DataLoadingModal;
