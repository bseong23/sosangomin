// /components/modal/DataLoadingModal/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataLoadingModalProps, Quiz } from "./types";
import LoadingScreen from "./LoadingScreen";
import CompletionScreen from "./CompletionScreen";
import QuizGame from "./QuizGame";

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
  {
    question:
      "소상공인 정책자금 중 '소상공인 경영안정자금'의 최대 대출 가능 금액은?",
    options: ["5천만원", "7천만원", "1억원", "2억원"],
    correctAnswer: 2,
    explanation:
      "소상공인 경영안정자금의 최대 대출 가능 금액은 일반적으로 1억원입니다. 다만 정책에 따라 변경될 수 있으니 소상공인시장진흥공단에 확인하는 것이 좋습니다."
  },
  {
    question: "음식점에서 테이블 회전율을 높이는 가장 좋은 방법은?",
    options: [
      "메뉴 가격 인상",
      "좌석 수 늘리기",
      "서비스 속도 개선",
      "영업시간 연장"
    ],
    correctAnswer: 2,
    explanation:
      "테이블 회전율을 높이기 위해서는 주문 접수부터 음식 제공, 계산까지의 서비스 속도를 개선하는 것이 가장 효과적입니다. 이는 동일한 좌석 수로 더 많은 고객을 응대할 수 있게 합니다."
  },
  {
    question: "음식점 매출 관리에서 ABC 분석이란?",
    options: [
      "매출순으로 메뉴를 A, B, C로 분류하는 것",
      "고객을 충성도에 따라 분류하는 것",
      "직원 평가 방식",
      "원가를 3등급으로 나누는 것"
    ],
    correctAnswer: 0,
    explanation:
      "ABC 분석은 메뉴를 매출 기여도에 따라 A(상위 20% 메뉴), B(중간 30% 메뉴), C(하위 50% 메뉴)로 분류하여 각 그룹별로 다른 전략을 적용하는 방식입니다."
  },
  {
    question:
      "식자재 발주시 적정 재고 관리를 위한 '적정 재고량'을 계산하는 공식은?",
    options: [
      "평균 일일 소비량 × 발주 주기",
      "최대 일일 소비량 × 발주 주기",
      "최소 일일 소비량 × 발주 주기",
      "평균 주간 소비량 ÷ 7"
    ],
    correctAnswer: 0,
    explanation:
      "적정 재고량은 일반적으로 '평균 일일 소비량 × 발주 주기'로 계산합니다. 여기에 안전 재고를 추가하면 더 안정적인 재고 관리가 가능합니다."
  },
  {
    question: "푸드코스트(Food Cost)가 낮을수록 좋은 이유는?",
    options: [
      "음식 품질이 좋아진다",
      "직원 급여를 더 줄 수 있다",
      "이익률이 높아진다",
      "세금이 줄어든다"
    ],
    correctAnswer: 2,
    explanation:
      "푸드코스트는 매출 대비 식재료 비용의 비율입니다. 이 비율이 낮을수록 같은 매출에서 더 많은 이익을 남길 수 있기 때문에 이익률이 높아집니다."
  },
  {
    question: "메뉴 엔지니어링에서 '스타(Star)' 메뉴의 특징은?",
    options: [
      "인기는 낮지만 이익률이 높은 메뉴",
      "인기와 이익률이 모두 높은 메뉴",
      "인기와 이익률이 모두 낮은 메뉴",
      "인기는 높지만 이익률이 낮은 메뉴"
    ],
    correctAnswer: 1,
    explanation:
      "메뉴 엔지니어링에서 '스타(Star)' 메뉴는 인기(판매량)와 이익률이 모두 높은 메뉴를 의미합니다. 이런 메뉴는 적극적으로 홍보하고 유지해야 합니다."
  },
  {
    question: "식당 운영에서 '마진율'과 '회전율' 중 더 중요한 것은?",
    options: [
      "항상 마진율",
      "항상 회전율",
      "두 가지 모두 중요하며 비즈니스 모델에 따라 다름",
      "메뉴 종류에 따라 다름"
    ],
    correctAnswer: 2,
    explanation:
      "마진율과 회전율은 모두 중요하며, 음식점의 컨셉과 비즈니스 모델에 따라 어느 쪽에 더 중점을 둘지 달라집니다. 고급 레스토랑은 마진율을, 패스트푸드는 회전율을 더 중시하는 경향이 있습니다."
  },
  {
    question:
      "배달앱 수수료가 15%일 때, 배달 주문의 손익분기점을 맞추기 위한 최소 마진율은?",
    options: ["15%", "20%", "30%", "50%"],
    correctAnswer: 1,
    explanation:
      "배달앱 수수료가 15%일 경우, 최소한 그 이상의 마진율(일반적으로 20% 이상)이 있어야 손익분기점을 넘길 수 있습니다."
  },
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

  // 게임 관련 상태
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizEnded, setQuizEnded] = useState<boolean>(false);

  // 분석 완료 알림 표시
  const [showCompletionNotice, setShowCompletionNotice] =
    useState<boolean>(false);

  // 이전 로딩 상태와 모달 상태를 기억하기 위한 ref
  const prevIsLoadingRef = useRef<boolean>(true);
  const prevIsOpenRef = useRef<boolean>(false);

  // 분석 완료 여부를 추적하는 상태
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);

  // 선택된 퀴즈 목록
  const [selectedQuizzes, setSelectedQuizzes] = useState<Quiz[]>([]);

  // 모달 닫기 및 리서치 페이지로 이동
  const handleViewResults = () => {
    // 부모 컴포넌트의 콜백 호출 (모달 닫기)
    onLoadingComplete();

    // 리서치 페이지로 네비게이션 상태 설정
    setAnalysisCompleted(true);
  };

  // 퀴즈 계속하기
  const handleContinueQuiz = () => {
    if (!gameActive) {
      initGame();
    }
    setShowCompletionNotice(false);
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
          }
        }
      });
    }

    // 이전 모달 상태 업데이트
    prevIsOpenRef.current = isOpen;
  }, [isOpen, analysisCompleted]);

  // 로딩 상태 변경 감지
  useEffect(() => {
    // 이전에 로딩 중이었고 현재 로딩이 완료되었을 때
    if (prevIsLoadingRef.current && !isLoading) {
      // 로딩 완료 알림 표시
      setShowCompletionNotice(true);
    }

    // 이전 로딩 상태 업데이트
    prevIsLoadingRef.current = isLoading;
  }, [isLoading]);

  // 게임 초기화
  const initGame = () => {
    // 최대 10개의 퀴즈만 무작위로 선택
    const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setSelectedQuizzes(selected);

    setGameActive(true);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setQuizEnded(false);
  };

  // 옵션 선택 처리
  const handleOptionSelect = (optionIndex: number) => {
    if (showAnswer) return; // 이미 답을 확인한 경우 선택 불가

    setSelectedOption(optionIndex);
    setShowAnswer(true);

    if (optionIndex === selectedQuizzes[currentQuizIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  // 다음 문제로 넘어가기
  const handleNextQuiz = () => {
    if (currentQuizIndex < selectedQuizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setQuizEnded(true);
    }
  };

  // 모달이 닫힐 때 게임 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setGameActive(false);
      setShowCompletionNotice(false);
    }
  }, [isOpen]);

  // 퀴즈 게임 초기화
  useEffect(() => {
    if (gameActive && selectedQuizzes.length === 0) {
      initGame();
    }
  }, [gameActive]);

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
          onStartQuiz={initGame}
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
          onRestartQuiz={initGame}
          onViewResults={handleViewResults}
        />
      );
    }

    // 기본 화면 (로딩 중)
    return (
      <LoadingScreen
        fileCount={fileCount}
        posType={posType}
        onStartQuiz={initGame}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-md shadow-xl w-full max-w-md mx-4 relative">
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
