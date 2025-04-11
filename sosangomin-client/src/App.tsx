import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
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
import ReviewDashBoard from "./pages/ReviewDashBoard";
import ReviewCompare from "@/pages/ReviewCompare";
import ResultPage from "@/pages/ResultPage";

// 기타 컴포넌트
import MainPage from "@/pages/MainPage";
import ServiceData from "@/pages/ServiceData";
import ServiceReview from "@/pages/ServiceReview";
import ServiceMap from "@/pages/ServiceMap";
import ServiceReport from "@/pages/ServiceReport";
import NoticePostEditPage from "./pages/NoticePostEditPage";

const PrivateRoute = ({ element }: { element: any }) => {
  const isLoggedIn = Boolean(localStorage.getItem("accessToken")); // 토큰 여부 확인
  return isLoggedIn ? element : <Navigate to="/login" />;
};

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
          <Route
            path="/mypage"
            element={<PrivateRoute element={<MyPage />} />}
          />

          {/* 커뮤니티 관련 라우트 */}
          <Route path="/community/notice" element={<Notice />} />
          <Route
            path="/community/notice/post/:noticeId"
            element={<NoticePostDetailPage />}
          />
          <Route
            path="/community/notice/write"
            element={<PrivateRoute element={<NoticePost />} />}
          />
          <Route
            path="/community/notice/edit/:noticeId"
            element={<PrivateRoute element={<NoticePostEditPage />} />}
          />

          <Route path="/community/news" element={<News />} />
          <Route path="/community/board" element={<Board />} />
          <Route
            path="/community/board/write"
            element={<PrivateRoute element={<WritePost />} />}
          />
          <Route
            path="/community/board/edit/:boardId"
            element={<PrivateRoute element={<BoardPostEditPage />} />}
          />
          <Route
            path="/community/board/post/:boardId"
            element={<BoardPostDetailPage />}
          />

          {/* 데이터 분석 관련 라우트 */}
          <Route
            path="/data-analysis/upload"
            element={<PrivateRoute element={<DataUploadPage />} />}
          />
          <Route
            path="/data-analysis/research"
            element={<PrivateRoute element={<ResearchPage />} />}
          />
          <Route path="/map" element={<Map />} />

          {/* 리뷰 관련 라우트 */}
          <Route
            path="/review/store"
            element={<PrivateRoute element={<ReviewDashBoard />} />}
          />
          <Route
            path="/review/compare"
            element={<PrivateRoute element={<ReviewCompare />} />}
          />

          {/* 종합보고서 및 서비스 소개 관련 라우트 */}
          <Route
            path="/result"
            element={<PrivateRoute element={<ResultPage />} />}
          />
          <Route path="/service_data" element={<ServiceData />} />
          <Route path="/service_review" element={<ServiceReview />} />
          <Route path="/service_map" element={<ServiceMap />} />
          <Route path="/service_report" element={<ServiceReport />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
