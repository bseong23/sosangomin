import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NewsListResponse, NewsParams } from "@/features/board/types/news";
import NewsList from "@/features/board/components/boards/NewsList";
import CategoryFilter from "@/features/board/components/boards/CategoryFilter";
import Pagination from "@/components/common/Pagination";
import Banner from "@/features/board/components/boards/Banner";
import Loading from "@/components/common/Loading";
import {
  fetchNewsPageCount,
  fetchNewsList
} from "@/features/board/api/newsApi";

const News: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [newsData, setNewsData] = useState<NewsListResponse>({
    items: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  });

  // URL에서 초기값 가져오기
  const [params, setParams] = useState<NewsParams>({
    page: Number(searchParams.get("page")) || 1,
    limit: 6,
    category: searchParams.get("category") || "all"
  });

  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageLoading, setPageLoading] = useState(false);

  // URL 파라미터가 변경될 때 params 상태 업데이트
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || "all";

    setParams((prev) => ({
      ...prev,
      page,
      category
    }));
  }, [searchParams]);

  // 카테고리에 따른 페이지 수 가져오기
  useEffect(() => {
    const getPageCount = async () => {
      setPageLoading(true);
      try {
        // 카테고리 정보를 API 요청에 포함
        const pageCount = await fetchNewsPageCount(params.category);
        setTotalPages(pageCount > 0 ? pageCount : 1); // 0이면 최소 1페이지로 설정
      } catch (error) {
        console.error("페이지 수 가져오기 실패:", error);
        setTotalPages(1); // 오류 시 기본값 1로 설정
      } finally {
        setPageLoading(false);
      }
    };

    getPageCount();
  }, [params.category]); // 카테고리가 변경될 때마다 페이지 수 다시 가져오기

  // 뉴스 목록 가져오기
  useEffect(() => {
    const getNewsList = async () => {
      if (pageLoading) return; // 페이지 로딩 중일 때는 뉴스 목록 가져오지 않음
      setLoading(true);
      try {
        // 현재 페이지가 총 페이지 수보다 크면 1페이지로 리셋
        if (params.page > totalPages && totalPages > 0) {
          // URL과 상태 모두 업데이트
          setSearchParams({
            page: "1",
            category: params.category || "all" // undefined일 경우 "all"로 설정
          });
          return;
        }

        // API에서 뉴스 목록 가져오기
        const response = await fetchNewsList(params);

        // API 응답이 배열인 경우 처리
        if (Array.isArray(response)) {
          setNewsData({
            items: response,
            totalCount: response.length,
            currentPage: params.page,
            totalPages: totalPages
          });
        }
        // API 응답이 객체인 경우 처리
        else {
          setNewsData({
            items: response.items || [],
            totalCount: response.totalCount || 0,
            currentPage: response.currentPage || params.page,
            totalPages: response.totalPages || totalPages
          });
        }
      } catch (error) {
        console.error("뉴스 로딩 실패:", error);
        setNewsData({
          items: [],
          totalCount: 0,
          currentPage: params.page,
          totalPages: totalPages
        });
      } finally {
        setLoading(false);
      }
    };

    getNewsList();
  }, [params, totalPages, pageLoading]);

  const handlePageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      category: params.category || "all" // 컴포넌트의 params 상태에서 카테고리 가져오기
    });
    window.scrollTo(0, 0);
  };

  // 카테고리 변경 시 URL 업데이트 (페이지는 1로 리셋)
  const handleCategoryChange = (category: string) => {
    setSearchParams({
      page: "1", // 카테고리 변경 시 페이지는 1로 리셋 (이 동작은 의도적임)
      category
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto py-8 px-3">
      <div className="w-full">
        <Banner />

        <div className="text-xl font-bold mb-6">최신 뉴스</div>

        <div className="flex justify-between items-center mb-6">
          <CategoryFilter
            activeCategory={params.category || "all"}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading || pageLoading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : newsData.items.length > 0 ? (
          <>
            <NewsList items={newsData.items} />
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={newsData.currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center py-20 text-gray-500">
            뉴스 데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
