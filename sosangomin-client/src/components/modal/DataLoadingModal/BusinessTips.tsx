// /components/modal/DataLoadingModal/BusinessTips.tsx
import React, { useState } from "react";

interface BusinessTipsProps {
  onStartQuiz: () => void;
}

const BusinessTips: React.FC<BusinessTipsProps> = ({ onStartQuiz }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // 요식업 소상공인을 위한 꿀팁 목록
  const businessTips = [
    {
      title: "마진율과 메뉴 가격 설정",
      content:
        "메뉴 가격은 식재료 원가의 3배 이상으로 책정하는 것이 일반적입니다. 식재료 원가율은 매출의 30% 이하로 유지하는 것이 안정적인 운영에 도움이 됩니다."
    },
    {
      title: "인기 메뉴 분석하기",
      content:
        "월 1회 메뉴별 판매량과 수익을 분석하세요. 인기 있고 수익성 높은 메뉴는 전면에 배치하고, 판매량이 낮은 메뉴는 개선하거나 메뉴판에서 제외하는 것이 좋습니다."
    },
    {
      title: "효율적인 재고 관리",
      content:
        "FIFO(선입선출) 원칙을 적용하고, 주문 주기와 최소 재고량을 명확히 설정하세요. 식재료 배달 날짜를 분산시키면 신선도를 유지하며 보관 공간을 효율적으로 사용할 수 있습니다."
    },
    {
      title: "직원 교육과 동기부여",
      content:
        "직원들에게 메뉴에 대한 충분한 교육을 제공하고, 우수 직원에게는 인센티브를 지급하세요. 잘 훈련된 직원은 고객 만족도와 매출 증가에 직접적인 영향을 미칩니다."
    },
    {
      title: "온라인 입지 확보하기",
      content:
        "구글 비즈니스 프로필, 네이버 플레이스를 등록하고 정기적으로 업데이트하세요. 맛집 앱이나 배달앱에서 좋은 평가를 받으면 신규 고객 유입에 큰 도움이 됩니다."
    },
    {
      title: "고정비 절감 방법",
      content:
        "전기료 절감을 위해 영업 시작 1시간 전에 설비를 켜고, LED 조명을 사용하세요. 물 사용량을 줄이기 위해 절수형 수도꼭지를 설치하는 것도 장기적으로 비용을 절감할 수 있습니다."
    },
    {
      title: "단골 고객 관리",
      content:
        "단골 고객 데이터베이스를 만들고 생일이나 기념일에 할인 쿠폰을 제공하세요. 단골 고객 1명의 가치는 신규 고객 10명의 가치와 맞먹는다는 점을 기억하세요."
    },
    {
      title: "식재료 구매 팁",
      content:
        "여러 공급업체의 가격을 비교하고, 계절 식재료를 활용하면 원가를 절감할 수 있습니다. 대량 구매 시 할인을 요청하고, 안정적인 공급업체와 장기적인 관계를 구축하세요."
    },
    {
      title: "세금 관리와 공제 활용",
      content:
        "사업 관련 모든 영수증을 보관하고, 세금 공제 항목을 놓치지 마세요. 분기별로 세무사와 상담하면 세금 관리를 효율적으로 할 수 있습니다."
    },
    {
      title: "손익분기점 파악하기",
      content:
        "일일 손익분기점 매출액을 계산하고 매일 확인하세요. 손익분기점을 알면 일일 목표 설정이 용이하고, 사업 상태를 명확히 파악할 수 있습니다."
    }
  ];

  const currentTip = businessTips[currentTipIndex];

  const handleNextTip = () => {
    setCurrentTipIndex((prevIndex) =>
      prevIndex < businessTips.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : businessTips.length - 1
    );
  };

  return (
    <div>
      {/* 로딩 배너 */}
      <div className="bg-blue-50 p-4">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bit-main"></div>
          <p className="text-bit-main font-medium">데이터 분석 중...</p>
        </div>
      </div>

      <div className="p-5">
        <h4 className="font-medium text-lg text-bit-main mb-4 text-center">
          요식업 소상공인 꿀팁
        </h4>

        <div className="bg-blue-50/50 rounded-lg p-4 mb-4">
          <h5 className="font-bold text-base mb-2">{currentTip.title}</h5>
          <p className="text-gray-700">{currentTip.content}</p>

          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-500">
              {currentTipIndex + 1} / {businessTips.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrevTip}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="이전 팁"
              >
                ◀
              </button>
              <button
                onClick={handleNextTip}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="다음 팁"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <button
            onClick={onStartQuiz}
            className="bg-indigo-900 text-white py-2.5 px-5 rounded-md hover:bg-indigo-800 transition-colors w-full"
          >
            퀴즈로 전환하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessTips;
