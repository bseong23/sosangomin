import React from "react";
import Logo from "@/assets/Logo.svg";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img
            src={Logo}
            alt="로고"
            className="animate-bounce animate-duration-2000"
            style={{
              animation: "customBounce 1.5s infinite ease-in-out"
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 커스텀 애니메이션을 적용하기 위한 전역 스타일
// 참고: 이 코드는 컴포넌트와 같은 파일에 있어야 하며,
// 앱의 진입점(App.tsx 또는 index.tsx)에서 이 스타일을 import 해야합니다.
const animationStyle = `
@keyframes customBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}
`;

// 스타일 태그를 문서에 추가
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = animationStyle;
  document.head.appendChild(styleElement);
}

export default Loading;
