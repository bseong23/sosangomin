// /components/modal/DataLoadingModal/QuizGame.tsx
import React from "react";
import { QuizGameProps } from "./types";

const QuizGame: React.FC<QuizGameProps> = ({
  quizzes,
  score,
  currentIndex,
  selectedOption,
  showAnswer,
  isQuizEnded,
  isLoading,
  onOptionSelect,
  onNextQuiz,
  onRestartQuiz,
  onViewResults
}) => {
  // 퀴즈가 종료된 경우 결과 화면 표시
  if (isQuizEnded) {
    return (
      <div>
        {/* 분석 완료 배너 */}
        <div className="bg-green-100 p-4">
          <p className="text-green-800 font-medium text-center">
            데이터 분석이 완료되었습니다!
          </p>
        </div>

        <div className="p-6 text-center">
          <h4 className="text-lg font-medium mb-3">소상공인 퀴즈</h4>

          <h5 className="text-base mb-2">퀴즈 결과</h5>
          <p className="mb-3">
            총 {quizzes.length}문제 중{" "}
            <span className="font-bold text-bit-main">{score}문제</span>를
            맞추셨습니다!
          </p>

          {score === quizzes.length ? (
            <p className="text-green-600 font-medium mb-3">
              🎉 완벽합니다! 모든 문제를 맞추셨습니다!
            </p>
          ) : score >= quizzes.length * 0.7 ? (
            <p className="text-green-600 font-medium mb-3">
              👏 잘 하셨습니다! 소상공인 지식이 풍부하시네요!
            </p>
          ) : score >= quizzes.length * 0.5 ? (
            <p className="text-blue-600 font-medium mb-3">
              👍 좋은 성적입니다! 조금만 더 공부해보세요!
            </p>
          ) : (
            <p className="text-yellow-600 font-medium mb-3">
              📚 소상공인 지식을 더 쌓아보세요!
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onRestartQuiz}
              className="flex-1 bg-indigo-900 text-white py-2.5 px-4 rounded-md hover:bg-indigo-800 transition-colors"
            >
              다시 도전하기
            </button>

            {!isLoading && (
              <button
                onClick={onViewResults}
                className="flex-1 bg-green-500 text-white py-2.5 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                분석 결과 보기
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 현재 풀고 있는 퀴즈
  const currentQuiz = quizzes[currentIndex];

  return (
    <div>
      {/* 분석 완료 배너 */}
      {!isLoading && (
        <div className="bg-green-100 p-4">
          <p className="text-green-800 font-medium text-center">
            데이터 분석이 완료되었습니다!
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            문제 {currentIndex + 1} / {quizzes.length}
          </span>
          <span className="text-sm text-gray-500">점수: {score}</span>
        </div>

        <h5 className="font-medium text-left mb-5">{currentQuiz.question}</h5>

        <div className="space-y-3 mb-4">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onOptionSelect(index)}
              disabled={showAnswer}
              className={`w-full py-3 px-4 text-left rounded-md border ${
                selectedOption === index
                  ? index === currentQuiz.correctAnswer
                    ? "bg-green-100 border-green-300 text-green-800"
                    : "bg-red-100 border-red-300 text-red-800"
                  : showAnswer && index === currentQuiz.correctAnswer
                  ? "bg-green-100 border-green-300 text-green-800"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showAnswer && (
          <div>
            <div
              className={`p-4 rounded-md mb-4 ${
                selectedOption === currentQuiz.correctAnswer
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <p className="font-medium mb-1">
                {selectedOption === currentQuiz.correctAnswer
                  ? "정답입니다! 👍"
                  : `오답입니다. 정답은 "${
                      currentQuiz.options[currentQuiz.correctAnswer]
                    }" 입니다.`}
              </p>
              <p className="text-sm">{currentQuiz.explanation}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onNextQuiz}
                className="flex-1 bg-indigo-900 text-white py-2.5 px-4 rounded-md hover:bg-indigo-800 transition-colors"
              >
                {currentIndex < quizzes.length - 1 ? "다음 문제" : "결과 보기"}
              </button>

              {!isLoading && (
                <button
                  onClick={onViewResults}
                  className="flex-1 bg-green-500 text-white py-2.5 px-4 rounded-md hover:bg-green-600 transition-colors"
                >
                  결과 보기
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizGame;
