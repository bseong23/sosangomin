import React from "react";
import { NewsItem as NewsItemType } from "@/features/board/types/news";

interface NewsItemProps {
  item: NewsItemType;
}

const NewsItem: React.FC<NewsItemProps> = ({ item }) => {
  return (
    <div className="border-b border-gray-200 py-4 hover:bg-gray-50">
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex"
      >
        {/* 좌측 이미지 영역 */}
        <div className="w-[120px] h-[120px] flex-shrink-0 mr-[18px] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
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
