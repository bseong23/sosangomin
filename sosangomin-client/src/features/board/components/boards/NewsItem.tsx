import React, { useState } from "react";
import { NewsItem as NewsItemType } from "@/features/board/types/news";
import Newsimg from "@/assets/defaultnews.png";

interface NewsItemProps {
  item: NewsItemType;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || Newsimg);

  const handleImageError = () => {
    setImgSrc(Newsimg);
  };

  return (
    <div className="border-b border-gray-200 hover:bg-gray-50 py-10 px-10">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex"
      >
        {/* 좌측 이미지 영역 */}
        <div className="w-30 h-30 flex-shrink-0 mr-5 overflow-hidden">
          <img
            src={imgSrc}
            alt={item.title}
            onError={handleImageError}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* 우측 텍스트 영역 */}
        <div className="flex flex-col justify-between flex-grow">
          <h3 className="text-lg font-medium line-clamp-2">{item.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500 text-sm">
              {item.pubDate.split("T")[0].replace(/-/g, ".")}
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default NewsItem;
