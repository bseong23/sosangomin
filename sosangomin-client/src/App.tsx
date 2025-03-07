import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import LoginPage from "./pages/LoginPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import WritePost from "./pages/BoardWritePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p className="h-screen">메인페이지</p>} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/auth/kakao/callback/*"
            element={<KakaoCallbackPage />}
          />
          <Route path="/signup" element={<div>회원가입 페이지</div>} />
          <Route
            path="/reset-password"
            element={<div>비밀번호 재설정 페이지</div>}
          />
          <Route path="/mypage" element={<div>마이페이지</div>} />
          <Route path="/community/notice" element={<div>공지사항</div>} />
          <Route
            path="/community/notice/post/:postId"
            element={<div>공지사항 상세</div>}
          />
          <Route
            path="/community/news"
            element={<div className="h-screen">뉴스 페이지</div>}
          />
          <Route path="/community/board" element={<div>게시판</div>} />
          <Route path="/community/board/write" element={<WritePost />} />
          <Route
            path="/community/board/edit"
            element={<div>게시글 수정</div>}
          />
          <Route
            path="/community/board/post/:postId"
            element={<div>게시글 상세</div>}
          />
          <Route
            path="/data-analysis/upload"
            element={<div>데이터 입력하기</div>}
          />
          <Route
            path="/data-analysis/research"
            element={<div>한눈에 보기기</div>}
          />
          <Route
            path="/data-analysis/insight"
            element={<div>분석리포트 보기</div>}
          />
          <Route
            path="/data-analysis/review-insight"
            element={<div>리뷰 분석하기</div>}
          />
          <Route path="/data-analysis/advise" element={<div>고민해결결</div>} />
          <Route path="/map" element={<div>지도 페이지</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
