import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import MobileLayout from "@/components/layouts/MobileLayout";
import ScrollToTop from "@/components/common/ScrollToTop";
import RouterChangeDetector from "./components/common/RouterChangeDetector";

// 인증 및 사용자 관련 페이지
import LoginPage from "@/pages/LoginPage";
import KakaoCallbackPage from "@/pages/KakaoCallbackPage";
import SignupPages from "@/pages/SignupPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import MyPage from "@/pages/Mypage";

// 커뮤니티 관련 페이지
import Notice from "@/pages/Notice";
import News from "@/pages/News";
import Board from "@/pages/Board";
import WritePost from "@/pages/BoardWritePage";
import BoardPostEditPage from "@/pages/BoardPostEditPage";
import BoardPostDetailPage from "@/pages/BoardPostDetailPage";
import NoticePost from "./pages/NoticePost";
import NoticePostDetailPage from "./pages/NoticePostDetailPage";

// 데이터 분석 관련 페이지
import DataUploadPage from "@/pages/DataUploadPage";
import ResearchPage from "@/pages/ResearchPage";
import Map from "@/pages/Map";
import ReviewStore from "@/pages/ReviewStore";
import ReviewCompare from "@/pages/ReviewCompare";
import ResultPage from "@/pages/ResultPage";

// 기타 컴포넌트
import MainPage from "@/pages/MainPage";
import NoticePostEditPage from "./pages/NoticePostEditPage";

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const AppLayout = isMobile ? MobileLayout : Layout;

  return (
    <Router>
      <RouterChangeDetector />
      <ScrollToTop /> {/* 여기에 ScrollToTop 컴포넌트 추가 */}
      <Routes>
        <Route element={<AppLayout />}>
          {/* 메인 페이지 */}
          <Route path="/" element={<MainPage />} />

          {/* 인증 및 사용자 관련 라우트 */}
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/kakao/callback/*"
            element={<KakaoCallbackPage />}
          />
          <Route path="/signup" element={<SignupPages />} />
          <Route path="/password" element={<ResetPasswordPage />} />
          <Route path="/mypage" element={<MyPage />} />

          {/* 커뮤니티 관련 라우트 */}
          <Route path="/community/notice" element={<Notice />} />
          <Route
            path="/community/notice/post/:noticeId"
            element={<NoticePostDetailPage />}
          />
          <Route path="/community/notice/write" element={<NoticePost />} />
          <Route
            path="/community/notice/edit/:noticeId"
            element={<NoticePostEditPage />}
          />

          <Route path="/community/news" element={<News />} />
          <Route path="/community/board" element={<Board />} />
          <Route path="/community/board/write" element={<WritePost />} />
          <Route
            path="/community/board/edit/:boardId"
            element={<BoardPostEditPage />}
          />
          <Route
            path="/community/board/post/:boardId"
            element={<BoardPostDetailPage />}
          />

          {/* 데이터 분석 관련 라우트 */}
          <Route path="/data-analysis/upload" element={<DataUploadPage />} />
          <Route path="/data-analysis/research" element={<ResearchPage />} />
          <Route path="/map" element={<Map />} />

          {/* 리뷰 관련 라우트 */}
          <Route path="/review/store" element={<ReviewStore />} />
          <Route path="/review/compare" element={<ReviewCompare />} />

          {/* 종합보고소 및 서비스 소개 관련 라우트 */}
          <Route path="/result" element={<ResultPage />} />
          <Route
            path="/service"
            element={<p className="h-screen">서비스 소개</p>}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
