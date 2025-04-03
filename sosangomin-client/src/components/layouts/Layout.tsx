import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatBot from "@/components/common/ChatBot";
import TopButton from "@/components/common/TopButton";

const Layout: React.FC = () => {
  const location = useLocation();

  // 메인 페이지 여부 확인
  const isMainPage = location.pathname === "/";
  const isMapPage = location.pathname.startsWith("/map");
  const isLoginPage = location.pathname === "/login";
  const isPasswordPage = location.pathname === "/password";
  const isSignupPage = location.pathname === "/signup";

  const showSidebar =
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/review") ||
    location.pathname.startsWith("/data-analysis");

  const showHeader =
    isMainPage ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/data-analysis") ||
    location.pathname.startsWith("/review") ||
    location.pathname.startsWith("/result") ||
    location.pathname.startsWith("/service") ||
    location.pathname.startsWith("/map") ||
    location.pathname.startsWith("/mypage");

  const showFooter =
    isMainPage ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/result") ||
    location.pathname.startsWith("/review") ||
    location.pathname.startsWith("/service") ||
    location.pathname.startsWith("/data-analysis");

  // ChatBot 표시 여부 결정 - 지도 페이지에서는 표시하지 않음
  const showChatBot =
    !isMapPage && !isLoginPage && !isPasswordPage && !isSignupPage;

  const showTopButton = !isMapPage;

  return (
    <div className="flex flex-col">
      {showHeader && (
        <div className="fixed top-0 left-0 w-full z-48">
          <Header />
        </div>
      )}
      <div className={`flex ${showHeader ? "pt-[73px]" : ""}`}>
        {showSidebar && <Sidebar />}
        <div className="flex flex-col w-full">
          {isMapPage ? (
            // 지도 페이지일 때 특별한 레이아웃
            <main className="flex w-full">
              <Outlet />
            </main>
          ) : (
            // 일반 페이지 레이아웃
            <main className="flex w-full">
              <div
                className={`w-full min-h-screen mx-auto ${
                  isMainPage ? "" : "px-4"
                }`}
              >
                <Outlet />
              </div>
            </main>
          )}
          {showTopButton && <TopButton />}
          {showChatBot && <ChatBot />}
          {showFooter && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
