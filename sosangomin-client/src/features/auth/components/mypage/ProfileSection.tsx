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
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="relative w-32 h-32">
          <img
            src={imageUrl || DefaultProfileImage}
            alt="프로필 이미지"
            className="w-32 h-32 rounded-full object-cover border-1 border-[#BEBEBE]"
          />

          {/* 로딩 오버레이 */}
          {isLoading && <Loading />}
        </div>

        {isEditable && !isLoading && (
          <button
            onClick={onEditImage}
            className="absolute -right-2 -bottom-2 bg-white rounded-full p-2 border border-gray-300 shadow-sm hover:bg-gray-50"
            aria-label="프로필 이미지 수정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="mt-5">
        <p className="text-[#BEBEBE] text-sm">
          이미지 용량은 1MB로 제한됩니다.
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
