import { useState } from "react";
import UserInfo from "@/features/auth/components/mypage/UserInfo";
import StoreModal from "@/components/modal/StoreModal";

const MyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8 p-4 max-w-[1200px]">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div>
        <h3 className="text-xl font-bold p-2">내 정보</h3>
        <UserInfo isEditable={true} />
      </div>
      <div className="flex gap-10 mt-8">
        <h3 className="text-xl font-bold p-1">내가 등록한 가게</h3>
        <button
          className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs"
          onClick={openModal}
        >
          가게 등록하기
        </button>
        {isModalOpen && <StoreModal onClose={closeModal} />}
      </div>
    </div>
  );
};

export default MyPage;
