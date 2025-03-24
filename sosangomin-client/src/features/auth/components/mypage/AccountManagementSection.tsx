// src/features/auth/components/mypage/AccountManagementSection.tsx
import React from "react";

interface AccountManagementSectionProps {
  onPasswordChange: () => void;
  onDeleteAccount: () => void;
}

const AccountManagementSection: React.FC<AccountManagementSectionProps> = ({
  onPasswordChange,
  onDeleteAccount
}) => {
  return (
    <div className="flex justify-end gap-5 mt-3 text-xs">
      <div
        onClick={onPasswordChange}
        className="text-comment hover:text-bit-main cursor-pointer"
      >
        비밀번호 수정하기
      </div>
      <div
        onClick={onDeleteAccount}
        className="text-comment hover:text-bit-main cursor-pointer"
      >
        회원탈퇴
      </div>
    </div>
  );
};

export default AccountManagementSection;
