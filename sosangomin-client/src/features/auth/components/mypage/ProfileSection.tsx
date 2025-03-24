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
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="relative w-30 h-30">
          <img
            src={imageUrl || DefaultProfileImage}
            alt="프로필 이미지"
            className="w-30 h-30 rounded-full object-cover border border-border"
          />

          {/* 로딩 오버레이 */}
          {isLoading && <Loading />}
        </div>

        {isEditable && !isLoading && (
          <button
            onClick={onEditImage}
            className="absolute -right-1 -bottom-1 bg-basic-white rounded-full p-1 border border-border shadow-sm hover:bg-gray-50"
            aria-label="프로필 이미지 수정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
    </div>
  );
};

export default ProfileSection;
