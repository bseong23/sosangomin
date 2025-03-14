// src/features/auth/components/mypage/EmailSection.tsx
import React from "react";

interface EmailSectionProps {
  email: string;
}

const EmailSection: React.FC<EmailSectionProps> = ({ email }) => {
  return (
    <div>
      <div className="text-xl font-medium text-gray-700 mb-2">이메일</div>
      <div className="text-xl border border-[#BEBEBE] rounded-[10px] p-4">
        {email}
      </div>
    </div>
  );
};

export default EmailSection;
