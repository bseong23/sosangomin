import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import MobileLayout from "@/components/layouts/MobileLayout";
import LoginPage from "@/pages/LoginPage";
import KakaoCallbackPage from "@/pages/KakaoCallbackPage";
import WritePost from "@/pages/BoardWritePage";
import BoardPostDetailPage from "@/pages/BoardPostDetailPage";
import Board from "@/pages/Board";
import Notice from "@/pages/Notice";
import News from "@/pages/News";
import BoardPostEditPage from "@/pages/BoardPostEditPage";
import Map from "@/pages/Map";
import SignupPages from "@/pages/SignupPage";
import MyPage from "@/pages/Mypage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import Piechartpage from "./pages/Piechartpage";
import ResearchPage from "@/pages/ResearchPage";

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
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<p className="h-screen">메인페이지</p>} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/kakao/callback/*"
            element={<KakaoCallbackPage />}
          />
          <Route path="/signup" element={<SignupPages />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/community/notice" element={<Notice />} />
          <Route
            path="/community/notice/post/:postId"
            element={<div>공지사항 상세</div>}
          />
          <Route path="/community/news" element={<News />} />
          <Route path="/community/board" element={<Board />} />
          <Route path="/community/board/write" element={<WritePost />} />
          <Route
            path="/community/board/edit/:postId"
            element={<BoardPostEditPage />}
          />
          <Route
            path="/community/board/post/:postId"
            element={<BoardPostDetailPage />}
          />
          <Route
            path="/data-analysis/upload"
            element={<div>데이터 입력하기</div>}
          />
          <Route
            path="/data-analysis/research"
            element={<div>한눈에 보기기</div>}
          />
          <Route path="/data-analysis/insight" element={<Piechartpage />} />
          <Route path="/data-analysis/research" element={<ResearchPage />} />
          <Route
            path="/data-analysis/insight"
            element={<div>분석리포트 보기</div>}
          />
          <Route
            path="/data-analysis/review-insight"
            element={<div>리뷰 분석하기</div>}
          />
          <Route path="/data-analysis/advise" element={<div>고민해결결</div>} />
          <Route path="/map" element={<Map />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
