import React from "react";
import Logo from "@/assets/Logo.svg";

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-[#F8F7F7] text-white font-inter">
      {/* 상단 섹션 */}
      <div className="flex items-center justify-between py-6 px-10">
        {/* 로고 섹션 */}
        <div className="text-lg font-bold">
          <img src={Logo} alt="Logo" className="w-32" />
        </div>

        {/* 링크 섹션 */}
        <div className="flex space-x-6 text-sm text-gray-400">
          <div>
            삼성청년소프트웨어 아카데미 서울특별시 강남구 테헤란로 212
            (1544-9001)
          </div>
        </div>

        {/* 소셜 미디어 및 이메일 */}
        <div className="flex items-center text-sm text-gray-400">
          <div>삼성청년소프트웨어 아카데미 12기 3반 A306팀</div>
        </div>
      </div>

      {/* 하단 저작권 표시 */}
      <div className="text-center text-sm pb-2 text-gray-400">
        © 2025 소상고민.All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
