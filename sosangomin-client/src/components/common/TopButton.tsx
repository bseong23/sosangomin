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
      // className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex bg-gray-50 border border-gray-200 shadow-3xl rounded-full shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] items-center justify-center overflow-hidden cursor-pointer"
      className={`fixed bottom-32 right-10 z-50 px-6 py-2 rounded-full shadow-3xl border border-gray-200 shadow-3xl shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1),-5px_0_5px_rgba(0,0,0,0.1),5px_0_5px_rgba(0,0,0,0.1)] items-center justify-center overflow-hidden cursor-pointer bg-white text-black transition-opacity duration-300 text-sm font-medium ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
};

export default TopButton;
