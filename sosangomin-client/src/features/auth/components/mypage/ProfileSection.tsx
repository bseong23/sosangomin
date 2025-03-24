import React from "react";
import DefaultProfileImage from "@/assets/profileImage.svg";
import Loading from "@/components/common/Loading";

interface ProfileSectionProps {
  imageUrl: string | null;
  isEditable?: boolean;
  onEditImage?: () => void;
  isLoading?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  imageUrl,
  isEditable = false,
  onEditImage,
  isLoading = false
}) => {
  return (
    <div className="relative">
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
        <img
          src={imageUrl || DefaultProfileImage}
          alt="프로필 이미지"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-border"
        />

        {/* 로딩 오버레이 */}
        {isLoading && <Loading />}
      </div>

      {/* 편집 버튼을 이미지 오른쪽 하단에 배치 */}
      {isEditable && !isLoading && (
        <button
          onClick={onEditImage}
          className="absolute -right-1 -bottom-0 bg-basic-white rounded-full p-1 sm:p-1.5 border border-border shadow-sm hover:bg-gray-50 group transition-all duration-200"
          aria-label="프로필 이미지 수정"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 group-hover:stroke-bit-main group-hover:fill-bit-main/10 transition-all duration-200"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProfileSection;
