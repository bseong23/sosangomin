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
    <div className="flex justify-end gap-10 mt-6 text-sm">
      <div
        onClick={onPasswordChange}
        className="text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        비밀번호 수정하기
      </div>
      <div
        onClick={onDeleteAccount}
        className="text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        회원탈퇴
      </div>
    </div>
  );
};

export default AccountManagementSection;
