// // components/main/CTASection.tsx

import React from "react";
import news from "@/assets/news.png";
import chatbot from "@/assets/chatbot.png";
import community from "@/assets/community.png";

const CTASection: React.FC = () => {
  // 각 카드에 맞는 이미지 매핑
  const cardImages = [
    { src: community, alt: "소상공인 커뮤니티" },
    { src: news, alt: "업계 뉴스 피드" },
    { src: chatbot, alt: "AI 챗봇 상담" }
  ];

  // 각 카드 데이터
  const cardData = [
    {
      title: "커뮤니티",
      desc: "같은 고민을 나누고 소통할 수 있는 공간이에요."
    },
    {
      title: "업계 뉴스 확인",
      desc: "매일 업데이트되는 최신 정책과 업계 소식을 확인해보세요."
    },
    {
      title: "AI 챗봇 상담",
      desc: "언제든지 궁금한 점을 챗봇에게 편하게 물어보세요."
    }
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20 lg:pt-40">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-bit-main font-extrabold text-xl sm:text-2xl text-center mb-8 sm:mb-10 md:mb-12">
          소상고민에는 이런 기능도 있어요
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-9">
            {cardData.map((item, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 p-6 sm:p-8 rounded-xl 
                  shadow-[0_0_15px_rgba(0,0,0,0.1)] 
                  border border-white border-opacity-20 
                  flex flex-col items-center justify-center
                 "
              >
                {/* transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] */}
                <div className="mb-4 sm:mb-6 h-28 sm:h-32 md:h-40 w-28 sm:w-32 md:w-40 flex items-center justify-center">
                  <img
                    src={cardImages[i].src}
                    alt={cardImages[i].alt}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 text-center  break-keep">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 반응형 장식 요소 */}
      <div className="hidden sm:block relative mt-16 overflow-hidden">
        <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent opacity-30"></div>
        <div className="absolute -top-12 left-1/4 w-16 h-16 md:w-24 md:h-24 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-8 right-1/3 w-20 h-20 md:w-32 md:h-32 bg-indigo-300 rounded-full opacity-15 blur-xl"></div>
      </div>
    </section>
  );
};

export default CTASection;
