// /components/modal/DataLoadingModal/types.ts
export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface DataLoadingModalProps {
  isOpen: boolean;
  fileCount: number;
  posType: string;
  isLoading: boolean;
  onLoadingComplete: () => void;
}

export interface LoadingScreenProps {
  fileCount: number;
  posType: string;
  onStartQuiz: () => void;
}

export interface CompletionScreenProps {
  onViewResults: () => void;
  onStartQuiz: () => void;
}

export interface QuizGameProps {
  quizzes: Quiz[];
  score: number;
  currentIndex: number;
  selectedOption: number | null;
  showAnswer: boolean;
  isQuizEnded: boolean;
  isLoading: boolean;
  onOptionSelect: (optionIndex: number) => void;
  onNextQuiz: () => void;
  onRestartQuiz: () => void;
  onViewResults: () => void;
}
