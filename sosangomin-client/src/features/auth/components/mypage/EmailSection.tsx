import React from "react";

interface EmailSectionProps {
  userType: string;
  email: string;
}

const EmailSection: React.FC<EmailSectionProps> = ({ email, userType }) => {
  return (
    <div>
      <div className="text-base font-medium text-comment mb-1">이메일</div>
      <div className="text-base rounded-md p-3">
        {email}
        {userType === "KAKAO" && (
          <div className="mt-1 text-xs">카카오 로그인</div>
        )}
      </div>
    </div>
  );
};

export default EmailSection;
