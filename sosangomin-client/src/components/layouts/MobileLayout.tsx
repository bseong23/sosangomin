import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/header/MobileHeader";
import Sidebar from "@/components/sidebar/MobileSidebar";
import ChatBot from "@/components/common/ChatBot";
const MobileLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 페이지 이동 시 사이드바 닫기
  useEffect(() => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  const isMainPage = location.pathname === "/";
  const isMapPage = location.pathname.startsWith("/map");
  const showHeader =
    isMainPage ||
    location.pathname.startsWith("/community") ||
    location.pathname.startsWith("/data-analysis") ||
    location.pathname.startsWith("/review") ||
    location.pathname.startsWith("/result") ||
    location.pathname.startsWith("/service") ||
    location.pathname.startsWith("/map") ||
    location.pathname.startsWith("/mypage");
  const showChatBot = !isMapPage;
  return (
    <div className="min-h-screen">
      {showHeader && <Header toggleSidebar={toggleSidebar} />}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay to close sidebar when clicked outside - 배경색과 투명도 수정 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Map 페이지, Main 페이지에서는 px-5 패딩 제거 */}
      <main
        className={`w-full mx-auto mt-1 ${
          isMapPage || isMainPage ? "" : "px-5"
        }`}
      >
        <Outlet />
      </main>
      {showChatBot && <ChatBot />}
    </div>
  );
};

export default MobileLayout;
