import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Sidebar from "@/components/sidebar/Sidebar";

const Layout: React.FC = () => {
  const location = useLocation();

  // 메인 페이지 여부 확인
  const isMainPage = location.pathname === "/";
  const isMapPage = location.pathname.startsWith("/map");

  const showSidebar =
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/data-analysis");

  const showHeader =
    isMainPage ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/data-analysis") ||
    location.pathname.startsWith("/map") ||
    location.pathname.startsWith("/mypage");

  const showFooter =
    isMainPage ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/data-analysis");

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Header />
        </div>
      )}
      <div className={`flex flex-grow ${showHeader ? "pt-[73px]" : ""}`}>
        {showSidebar && <Sidebar />}
        {isMapPage ? (
          // 지도 페이지일 때 특별한 레이아웃
          <main className="flex flex-grow w-full">
            <Outlet />
          </main>
        ) : (
          // 일반 페이지 레이아웃
          <main
            className={`flex flex-grow justify-center mx-auto ${
              !showHeader ? "w-full" : ""
            }`}
          >
            <div className={`${showHeader ? "container" : "w-full"}`}>
              <Outlet />
            </div>
          </main>
        )}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
