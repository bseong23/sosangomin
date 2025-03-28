// components/main/CTASection.tsx
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

  return (
    <section className="py-20 pt-40">
      <div className="container mx-auto px-4">
        <h2 className="text-bit-main font-extrabold text-2xl text-center mb-12">
          소상고민에는 이런 기능도 있어요
        </h2>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-9">
            {[
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
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 p-8 rounded-xl 
                  shadow-[0_0_15px_rgba(0,0,0,0.1)] 
                  border border-white border-opacity-20 
                  flex flex-col items-center justify-center
                  transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]"
              >
                <div className="mb-6 h-40 w-40 flex items-center justify-center">
                  <img
                    src={cardImages[i].src}
                    alt={cardImages[i].alt}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  {item.title}
                </h3>
                <p className="text-sm opacity-90 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
