import { useState } from "react";
import UserInfo from "@/features/auth/components/mypage/UserInfo";
import StoreModal from "@/components/modal/StoreModal";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

const MyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { userProfile } = useUserProfile();

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen max-w-[1000px] mx-auto md:p-6 p-4 space-y-5">
      {/* 환영 메시지 */}
      <div className="mt-10 px-4">
        <h2 className="text-lg font-semibold">환영합니다!</h2>
        <p className="text-comment mt-2">
          {userProfile?.nickname || "소상공인"}님, 오늘 하루도 좋은 하루
          보내세요
        </p>
      </div>

      {/* 프로필 카드 */}
      <div className="px-4">
        <div className="bg-white rounded-lg">
          <UserInfo isEditable={true} />
        </div>
      </div>

      {/* 가게 등록 섹션 (기존 코드) */}
      <div className="mt-8 px-4">
        <div className="flex gap-6 items-center justify-between">
          <h3 className="text-lg font-medium">내가 등록한 가게</h3>
          <button
            className="bg-bit-main text-white p-2 rounded-lg hover:bg-blue-900 cursor-pointer text-xs"
            onClick={openModal}
          >
            가게 등록하기
          </button>
          {isModalOpen && <StoreModal onClose={closeModal} />}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
