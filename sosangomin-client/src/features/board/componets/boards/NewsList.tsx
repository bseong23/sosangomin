import React from "react";
import { NewsItem as NewsItemType } from "@/types/news";
import NewsItem from "./NewsItem";

interface NewsListProps {
  items: NewsItemType[];
}

const NewsList: React.FC<NewsListProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      {items.slice(0, 8).map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default NewsList;
