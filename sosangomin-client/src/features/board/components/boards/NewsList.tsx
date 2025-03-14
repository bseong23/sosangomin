import React from "react";
import { NewsItem as NewsItemType } from "@/features/board/types/news";
import NewsItem from "@/features/board/components/boards/NewsItem";

interface NewsListProps {
  items: NewsItemType[];
}

const NewsList: React.FC<NewsListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
      {items.slice(0, 8).map((item) => (
        <NewsItem key={item.link} item={item} />
      ))}
    </div>
  );
};

export default NewsList;
