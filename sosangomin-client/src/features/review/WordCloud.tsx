import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface WordCloudProps {
  positive_words: Record<string, number>;
  negative_words: Record<string, number>;
  maxWords?: number;
}

interface WordPosition {
  x: number;
  y: number;
  rotation: number;
  fontSize: number;
}

const WordCloud: React.FC<WordCloudProps> = ({
  positive_words = {},
  negative_words = {},
  maxWords = 10
}) => {
  // 상위 단어만 추출하는 함수
  const getTopWords = (words: Record<string, number>, count: number) => {
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1]) // 빈도수 기준 내림차순 정렬
      .slice(0, count) // 상위 n개만 선택
      .map(([text, frequency]) => ({ text, frequency }));
  };

  // 상위 10개 단어만 추출
  const topPositiveWords = getTopWords(positive_words, maxWords);
  const topNegativeWords = getTopWords(negative_words, maxWords);

  // 화면에 표시되는 단어 상태 (애니메이션에 사용)
  const [visiblePositiveWords, setVisiblePositiveWords] = useState<number>(0);
  const [visibleNegativeWords, setVisibleNegativeWords] = useState<number>(0);

  // 각 영역별 단어의 위치 정보를 저장
  const positivePositionsRef = useRef<WordPosition[]>([]);
  const negativePositionsRef = useRef<WordPosition[]>([]);

  // 초기 마운트 시 한 번만 모든 단어의 위치 계산
  useEffect(() => {
    // 긍정 단어 위치 계산
    if (positivePositionsRef.current.length === 0) {
      positivePositionsRef.current = topPositiveWords.map((word) => {
        // 빈도수에 따른 폰트 크기 계산 (최소 14px, 최대 28px)
        const maxFrequency = topPositiveWords[0].frequency; // 가장 높은 빈도수
        const sizeRatio = word.frequency / maxFrequency; // 상대적 빈도 비율
        const fontSize = 14 + sizeRatio * 14; // 14px ~ 28px 범위로 매핑

        // 왼쪽 영역 내에서 위치 계산
        const x = 10 + Math.random() * 30; // 10~40% (왼쪽 영역 내)
        const y = 20 + Math.random() * 60; // 20~80% (위아래 여백 고려)
        const rotation = Math.floor(Math.random() * 41) - 20; // -20~20도

        return { x, y, rotation, fontSize };
      });
    }

    // 부정 단어 위치 계산
    if (negativePositionsRef.current.length === 0) {
      negativePositionsRef.current = topNegativeWords.map((word) => {
        // 빈도수에 따른 폰트 크기 계산
        const maxFrequency =
          topNegativeWords.length > 0 ? topNegativeWords[0].frequency : 1;
        const sizeRatio = word.frequency / maxFrequency;
        const fontSize = 14 + sizeRatio * 14; // 14px ~ 28px

        // 오른쪽 영역 내에서 위치 계산
        const x = 60 + Math.random() * 30; // 60~90% (오른쪽 영역 내)
        const y = 20 + Math.random() * 60; // 20~80%
        const rotation = Math.floor(Math.random() * 41) - 20; // -20~20도

        return { x, y, rotation, fontSize };
      });
    }
  }, [topPositiveWords, topNegativeWords]);

  // 긍정 단어 애니메이션 효과
  useEffect(() => {
    if (visiblePositiveWords < topPositiveWords.length) {
      const timer = setTimeout(() => {
        setVisiblePositiveWords((prev) => prev + 1);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [visiblePositiveWords, topPositiveWords.length]);

  // 부정 단어 애니메이션 효과 (동시에 시작)
  useEffect(() => {
    if (visibleNegativeWords < topNegativeWords.length) {
      const timer = setTimeout(() => {
        setVisibleNegativeWords((prev) => prev + 1);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [visibleNegativeWords, topNegativeWords.length]);

  return (
    <div className="relative h-80 w-full bg-gray-50 rounded-lg overflow-hidden mb-6">
      {/* 영역 구분을 위한 컨테이너 */}
      <div className="flex h-full">
        {/* 긍정 단어 영역 (왼쪽 50%) */}
        <div className="relative w-1/2 h-full border-r border-gray-200">
          <div className="absolute inset-0 p-4">
            <h3 className="text-blue-700 font-bold text-center mb-4">
              긍정적 키워드
            </h3>

            {/* 긍정 단어 */}
            {topPositiveWords
              .slice(0, visiblePositiveWords)
              .map((word, index) => {
                if (positivePositionsRef.current.length <= index) {
                  return <div key={`positive-${index}`}></div>;
                }

                const position = positivePositionsRef.current[index];

                return (
                  <motion.div
                    key={`positive-${index}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      fontSize: `${position.fontSize}px`,
                      fontWeight: position.fontSize > 20 ? "bold" : "normal",
                      color: "#3056D3",
                      zIndex: Math.floor(position.fontSize),
                      transform: `rotate(${position.rotation}deg)`,
                      transformOrigin: "center center"
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut"
                    }}
                  >
                    {word.text}
                  </motion.div>
                );
              })}
          </div>
        </div>

        {/* 부정 단어 영역 (오른쪽 50%) */}
        <div className="relative w-1/2 h-full">
          <div className="absolute inset-0 p-4">
            <h3 className="text-red-600 font-bold text-center mb-4">
              부정적 키워드
            </h3>

            {/* 부정 단어 */}
            {topNegativeWords.length > 0 ? (
              topNegativeWords
                .slice(0, visibleNegativeWords)
                .map((word, index) => {
                  if (negativePositionsRef.current.length <= index) {
                    return <div key={`negative-${index}`}></div>;
                  }

                  const position = negativePositionsRef.current[index];

                  return (
                    <motion.div
                      key={`negative-${index}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
                      style={{
                        left: `${position.x - 50}%`,
                        top: `${position.y}%`,
                        fontSize: `${position.fontSize}px`,
                        fontWeight: position.fontSize > 20 ? "bold" : "normal",
                        color: "#EF4444",
                        zIndex: Math.floor(position.fontSize),
                        transform: `rotate(${position.rotation}deg)`,
                        transformOrigin: "center center"
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                    >
                      {word.text}
                    </motion.div>
                  );
                })
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">부정적 키워드가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 사용 예시
const AnimatedWordCloud: React.FC = () => {
  // 백엔드에서 받은 형식의 샘플 데이터
  const data = {
    positive_words: {
      명태: 60,
      보기: 41,
      조림: 37,
      양념: 27,
      매콤: 23,
      사장: 19,
      점심: 11,
      맛집: 11,
      최고: 10,
      코다리: 9,
      반찬: 9,
      양도: 9,
      도둑: 9,
      방문: 8,
      콩나물: 7,
      하나: 7,
      자주: 7,
      직원: 7
    },
    negative_words: {}
  };

  return (
    <WordCloud
      positive_words={data.positive_words}
      negative_words={data.negative_words}
      maxWords={10}
    />
  );
};

export default AnimatedWordCloud;
