import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { WordCloudProps, WordPosition } from "@/features/review/types/review";

const excludeWords = ["보기", "여자", "남자"]; // 제외할 단어들

const filterWords = (words: Record<string, number>, exclude: string[]) => {
  return Object.fromEntries(
    Object.entries(words).filter(([word]) => !exclude.includes(word))
  );
};

const WordCloud: React.FC<WordCloudProps> = ({
  words = {},
  title,
  colors = {
    primary: "#1E3A8A", // 진한 파랑
    secondary: "#2563EB", // 중간 파랑
    accent: "#93C5FD"
  }, // 밝은 파랑},
  maxWords = 15,
  height = "h-72"
}) => {
  const filteredWords = filterWords(words, excludeWords);

  // 상위 단어만 추출하는 함수
  const getTopWords = (words: Record<string, number>, count: number) => {
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([text, frequency]) => ({ text, frequency }));
  };

  // 상위 단어만 추출
  const topWords = getTopWords(filteredWords, maxWords);

  // 단어들의 애니메이션 완료 상태
  const [, setAnimationComplete] = useState(false);

  // 단어 위치 정보를 저장
  const positionsRef = useRef<WordPosition[]>([]);

  // 나선형 배치 알고리즘
  const calculateSpiralLayout = () => {
    if (topWords.length === 0) return [];

    const positions: WordPosition[] = [];
    const topMargin = title ? 15 : 5;

    // 최대 빈도수 찾기
    const maxFrequency = Math.max(...topWords.map((w) => w.frequency));

    // 중심점
    const centerX = 40;
    const centerY = topMargin + (80 - topMargin) / 2;

    // 첫 번째 단어(가장 중요한 단어)는 중앙에 배치
    const mainWord = topWords[0];
    const mainSizeRatio = Math.sqrt(mainWord.frequency / maxFrequency);
    const mainFontSize = 24 + Math.floor(mainSizeRatio * 24); // 24px ~ 48px

    positions.push({
      x: centerX,
      y: centerY,
      fontSize: mainFontSize,
      opacity: 1,
      delay: 0
    });

    // 황금 각도 (약 137.5°)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // 나머지 단어들을 나선형으로 배치
    for (let i = 1; i < topWords.length; i++) {
      const word = topWords[i];
      const sizeRatio = Math.sqrt(word.frequency / maxFrequency);
      const fontSize = 18 + Math.floor(sizeRatio * 24); // 18px ~ 42px

      // 나선 배치에 사용될 각도와 거리
      const angle = i * goldenAngle;

      // 중요도와 인덱스에 따른 거리 조정
      // 빈도가 높은 단어는 중앙에 가깝게, 낮은 단어는 멀리
      const distanceMultiplier = 1 - sizeRatio * 0.5; // 빈도에 따른 거리 조정
      const baseDistance = 25 + i * 2; // 기본 거리 (인덱스가 증가할수록 멀어짐)
      const distance = baseDistance * distanceMultiplier;

      // 실제 좌표 계산
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // 위치 조정 (화면 범위 내에 유지)
      const safeX = Math.max(10, Math.min(90, x));
      const safeY = Math.max(topMargin + 5, Math.min(95, y));

      positions.push({
        x: safeX,
        y: safeY,
        fontSize,
        opacity: 0.7 + sizeRatio * 0.3,
        delay: i * 0.05 // 순차적 등장
      });
    }

    return positions;
  };

  // 초기 마운트 시 한 번만 모든 단어의 위치 계산
  useEffect(() => {
    if (positionsRef.current.length === 0 && topWords.length > 0) {
      positionsRef.current = calculateSpiralLayout();
    }

    // 모든 애니메이션 완료 시간 설정
    const maxDelay = Math.max(
      ...positionsRef.current.map((p) => p.delay || 0),
      0
    );

    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, (maxDelay + 0.5) * 1000);

    return () => clearTimeout(timer);
  }, [topWords, title]);

  return (
    <div
      className={`relative ${height} w-full bg-gray-50 rounded-lg overflow-hidden mb-6`}
    >
      {/* 제목 영역 (있을 경우) */}
      {title && (
        <div className="select-none absolute inset-x-0 top-0 h-12 flex items-center justify-center border-b border-gray-100 bg-white z-10">
          <h3 className="text-lg font-bold " style={{ color: colors.primary }}>
            {title}
          </h3>
        </div>
      )}

      {/* 워드 클라우드 영역 */}
      <div className={`absolute inset-0 overflow-hidden select-none`}>
        {/* 단어들 */}
        {topWords.map((word, index) => {
          if (positionsRef.current.length <= index) {
            return <div key={`word-${index}`}></div>;
          }

          const position = positionsRef.current[index];
          const isMainWord = index === 0;

          return (
            <motion.div
              key={`word-${index}`}
              className="absolute whitespace-nowrap"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                fontSize: `${position.fontSize}px`,
                fontWeight: isMainWord ? "900" : index < 3 ? "700" : "600",
                color: isMainWord ? colors.primary : colors.secondary,
                opacity: 0, // 초기 상태는 투명
                zIndex: topWords.length - index,
                transformOrigin: "center center",
                textShadow: isMainWord ? "0 0 1px rgba(0,0,0,0.1)" : "none",
                transform: "translate(-50%, -50%)"
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: position.opacity,
                scale: 1
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: position.delay
              }}
            >
              {word.text}
            </motion.div>
          );
        })}

        {topWords.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-md md:text-xl text-gray-500">
              표시할 키워드가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCloud;
