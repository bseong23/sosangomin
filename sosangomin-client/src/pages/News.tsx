import React, { useEffect, useState } from "react";
import {
  NewsItem,
  NewsListResponse,
  NewsParams
} from "@/features/board/types/news";
import NewsList from "@/features/board/components/boards/NewsList";
import CategoryFilter from "@/features/board/components/boards/CategoryFilter";
import Pagination from "@/components/common/Pagination";
import Banner from "@/features/board/components/boards/Banner";
import Loading from "@/components/common/Loading";

const News: React.FC = () => {
  // 더미 데이터
  const dummyData: NewsItem[] = [
    {
      id: 1,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/1/400/300",
      date: "2025.03.06",
      category: "지원정책"
    },
    {
      id: 2,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/2/400/300",
      date: "2025.03.06",
      category: "창업정보"
    },
    {
      id: 3,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/3/400/300",
      date: "2025.03.06",
      category: "경영관리"
    },
    {
      id: 4,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/4/400/300",
      date: "2025.03.06",
      category: "시장동향"
    },
    {
      id: 5,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/5/400/300",
      date: "2025.03.06",
      category: "홍보물"
    },
    {
      id: 6,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/6/400/300",
      date: "2025.03.06",
      category: "지원정책"
    },
    {
      id: 7,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/6/400/300",
      date: "2025.03.06",
      category: "지원정책"
    },
    {
      id: 8,
      title: "소상공인 자금지원 드디어 살아나는 경제?",
      imageUrl: "https://picsum.photos/id/6/400/300",
      date: "2025.03.06",
      category: "지원정책"
    }
  ];

  const [newsData, setNewsData] = useState<NewsListResponse>({
    items: dummyData,
    totalCount: dummyData.length,
    currentPage: 1,
    totalPages: 10
  });

  const [params, setParams] = useState<NewsParams>({
    page: 1,
    limit: 6,
    category: "all"
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getNewsList = async () => {
      setLoading(true);
      try {
        // 검색 및 카테고리 필터링 시뮬레이션
        let filteredData = [...dummyData];

        if (params.category && params.category !== "all") {
          filteredData = dummyData.filter(
            (item) => item.category === params.category
          );
        }

        if (params.search) {
          filteredData = filteredData.filter((item) =>
            item.title.toLowerCase().includes(params.search!.toLowerCase())
          );
        }

        setTimeout(() => {
          setNewsData({
            items: filteredData,
            totalCount: filteredData.length,
            currentPage: params.page,
            totalPages: Math.ceil(filteredData.length / params.limit)
          });
          setLoading(false);
        });
      } catch (error) {
        console.error("뉴스 로딩 실패:", error);
        setLoading(false);
      }
    };

    getNewsList();
  }, [params]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleCategoryChange = (category: string) => {
    setParams((prev) => ({ ...prev, page: 1, category }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto py-8 font-inter">
      <div className="w-full">
        <Banner />

        <h1 className="text-2xl font-bold mb-6">최신 뉴스</h1>

        <div className="flex justify-between items-center mb-6">
          <CategoryFilter
            activeCategory={params.category || "all"}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : (
          <>
            <NewsList items={newsData.items} />
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={newsData.currentPage}
                totalPages={newsData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default News;
