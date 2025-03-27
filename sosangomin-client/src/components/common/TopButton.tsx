import React, { useEffect, useState } from "react";

const TopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 300); // 300px 이상 내려가면 버튼 보이기
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0
      //   behavior: "smooth" // 부드럽게 스크롤
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-32 right-11 z-50 px-6 py-2 rounded-full shadow-lg border border-border bg-white text-black transition-opacity duration-300 text-sm font-medium ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default TopButton;
