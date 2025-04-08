import React, { useEffect, useState } from "react";
import HeroSection from "@/features/main/components/HeroSection";
import FeatureSection from "@/features/main/components/FeatureSection";
import CTASection from "@/features/main/components/CTASection";
import { getStoreList } from "@/features/auth/api/mypageApi";
import useStoreStore from "@/store/storeStore";
import { StoreInfo, StoreListResponse } from "@/features/auth/types/mypage";
import Loading from "@/components/common/Loading";

const MainPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로딩 상태 관리
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const [, setStoreListData] = useState<StoreListResponse | null>(null);
  const { setRepresentativeStore } = useStoreStore();

  useEffect(() => {
    const checkAndFetchStores = async () => {
      // store-storage 확인
      const storeStorage = localStorage.getItem("store-storage");
      const isDefaultStoreState =
        !storeStorage ||
        storeStorage ===
          '{"state":{"representativeStore":null,"stores":[]},"version":0}';

      // auth-storage 확인
      const authStorage = localStorage.getItem("auth-storage");
      const isDefaultAuthState =
        !authStorage ||
        authStorage === '{"state":{"userInfo":null},"version":0}';

      // store-storage가 기본 상태이고 auth-storage가 기본 상태가 아닐 때만 API 호출
      if (isDefaultStoreState && !isDefaultAuthState) {
        try {
          const response = await getStoreList();
          setStoreListData(response);

          if (response.status === "success" && response.stores.length > 0) {
            // is_main이 true인 가게 찾기
            const mainStore = response.stores.find(
              (store: StoreInfo) => store.is_main === true
            );

            // is_main이 true인 가게가 있으면 그걸 대표 가게로 설정
            if (mainStore) {
              setRepresentativeStore(mainStore);
            }
            // is_main이 true인 가게가 없으면 첫 번째 가게를 대표 가게로 설정
            else {
              setRepresentativeStore(response.stores[0]);
            }
          }
        } catch (error) {
          console.error("가게 목록 불러오기 실패:", error);
        }
      }
    };

    checkAndFetchStores();
  }, []); // representativeStore 의존성 제거

  // 스크롤 관련 최적화를 위한 설정
  useEffect(() => {
    // 페이지 진입 시 스크롤 위치 초기화
    window.scrollTo(0, 0);

    // 성능 최적화를 위한 passive 스크롤 리스너
    document.addEventListener("touchstart", () => {}, { passive: true });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </div>
  );
};

export default MainPage;
