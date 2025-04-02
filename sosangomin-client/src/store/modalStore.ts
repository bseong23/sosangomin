// /store/modalStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Quiz } from "@/components/modal/quizData";

// 스토어 타입 정의
interface FileModalState {
  // 모달 상태
  isModalOpen: boolean;
  isLoading: boolean;
  fileCount: number;
  posType: string;

  // 분석 관련 상태
  analysisCompleted: boolean;
  showCompletionNotice: boolean;

  // 퀴즈 게임 상태
  gameActive: boolean;
  selectedQuizzes: Quiz[];
  currentQuizIndex: number;
  selectedOption: number | null;
  showAnswer: boolean;
  score: number;
  quizEnded: boolean;

  // 모달 관련 액션
  openModal: () => void;
  closeModal: () => void;
  setLoading: (isLoading: boolean) => void;
  setFileData: (fileCount: number, posType: string) => void;
  setAnalysisCompleted: (completed: boolean) => void;
  completeLoading: () => void;

  // 퀴즈 관련 액션
  initGame: (quizzes: Quiz[]) => void;
  selectOption: (optionIndex: number) => void;
  nextQuiz: () => void;
  resetGame: () => void;

  // 분석 완료 후 초기화
  resetAfterAnalysis: () => void;
}

// Zustand 스토어 생성
const useFileModalStore = create<FileModalState>()(
  persist(
    (set, get) => ({
      // 모달 초기 상태
      isModalOpen: false,
      isLoading: false,
      fileCount: 0,
      posType: "",

      // 분석 관련 초기 상태
      analysisCompleted: false,
      showCompletionNotice: false,

      // 퀴즈 게임 초기 상태
      gameActive: false,
      selectedQuizzes: [],
      currentQuizIndex: 0,
      selectedOption: null,
      showAnswer: false,
      score: 0,
      quizEnded: false,

      // 모달 관련 액션
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setLoading: (isLoading) => set({ isLoading }),

      setFileData: (fileCount, posType) => set({ fileCount, posType }),

      setAnalysisCompleted: (completed) =>
        set({ analysisCompleted: completed }),

      completeLoading: () =>
        set({
          isLoading: false,
          showCompletionNotice: true
        }),

      // 퀴즈 게임 관련 액션
      initGame: (quizzes) => {
        // 최대 10개의 퀴즈만 무작위로 선택
        const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);

        set({
          gameActive: true,
          selectedQuizzes: selected,
          currentQuizIndex: 0,
          selectedOption: null,
          showAnswer: false,
          score: 0,
          quizEnded: false
        });
      },

      selectOption: (optionIndex) => {
        const { showAnswer, selectedQuizzes, currentQuizIndex, score } = get();

        // 이미 답을 확인한 경우 무시
        if (showAnswer) return;

        // 정답 확인 및 점수 업데이트
        const isCorrect =
          optionIndex === selectedQuizzes[currentQuizIndex].correctAnswer;

        set({
          selectedOption: optionIndex,
          showAnswer: true,
          score: isCorrect ? score + 1 : score
        });
      },

      nextQuiz: () => {
        const { currentQuizIndex, selectedQuizzes } = get();

        if (currentQuizIndex < selectedQuizzes.length - 1) {
          set({
            currentQuizIndex: currentQuizIndex + 1,
            selectedOption: null,
            showAnswer: false
          });
        } else {
          set({ quizEnded: true });
        }
      },

      resetGame: () =>
        set({
          gameActive: false,
          selectedQuizzes: [],
          currentQuizIndex: 0,
          selectedOption: null,
          showAnswer: false,
          score: 0,
          quizEnded: false
        }),

      // 분석 완료 후 초기화 함수
      resetAfterAnalysis: () =>
        set({
          // 파일 상태 초기화
          fileCount: 0,

          // 분석 관련 상태 초기화
          isLoading: false,
          analysisCompleted: false,
          showCompletionNotice: false,
          posType: ""

          // 모달 상태는 상황에 따라 결정 (필요하면 아래 주석 해제)
          // isModalOpen: false,

          // 퀴즈 상태는 resetGame에서 관리하므로 여기서는 초기화하지 않음
        })
    }),
    {
      name: "file-modal-storage", // localStorage에 저장될 키 이름
      partialize: (state) => ({
        // 모달 상태 및 필요한 상태만 저장
        isModalOpen: state.isModalOpen,
        isLoading: state.isLoading,
        posType: state.posType,

        // 퀴즈 상태 저장
        gameActive: state.gameActive,
        selectedQuizzes: state.selectedQuizzes,
        currentQuizIndex: state.currentQuizIndex,
        score: state.score,
        quizEnded: state.quizEnded
      })
    }
  )
);

export default useFileModalStore;
