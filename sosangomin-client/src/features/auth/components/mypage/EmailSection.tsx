import React from "react";

interface EmailSectionProps {
  userType: string;
  email: string;
}

const EmailSection: React.FC<EmailSectionProps> = ({ email, userType }) => {
  return (
    <div>
      <div className="text-xl font-medium text-comment mb-2">이메일</div>
      <div className="text-xl border border-border rounded-md p-4">
        {email}
        {userType === "KAKAO" && (
          <div className="mt-2 text-sm text-[#FEE500] bg-[#FEE50015] px-3 py-1 inline-block rounded-full">
            카카오로그인입니다
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSection;
