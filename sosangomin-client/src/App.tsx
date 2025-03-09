import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import WritePost from "@/pages/BoardWritePage";
import BoardPostDetailPage from "@/pages/BoardPostDetailPage";

const App: React.FC = () => {
  return (
    <Router>
      {/* flex column 레이아웃 적용, 최소 높이 100vh로 설정 */}
      <Header />
      <div className="flex flex-col min-h-screen">
        {/* 메인 콘텐츠 영역이 남은 공간 모두 차지 */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <p className="text-4xl font-bold text-blue-500 mt-4">
                  메인페이지
                </p>
              }
            />
            <Route path="/login" element={<div>로그인 페이지</div>} />
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
            <Route path="/community/news" element={<div>뉴스 페이지</div>} />
            <Route path="/community/board" element={<div>게시판</div>} />
            <Route path="/community/board/write" element={<WritePost />} />
            <Route
              path="/community/board/edit"
              element={<div>게시글 수정</div>}
            />
            <Route
              path="/community/board/post/:postId"
              element={<BoardPostDetailPage />}
            />
            <Route
              path="/data-analysis/upload"
              element={<div>데이터 업로드</div>}
            />
            <Route
              path="/data-analysis/insight"
              element={<div>데이터 인사이트</div>}
            />
            <Route
              path="/data-analysis/review-insight"
              element={<div>리뷰 인사이트</div>}
            />
            <Route
              path="/data-analysis/advise"
              element={<div>데이터 분석 조언</div>}
            />
            <Route path="/map" element={<div>지도 페이지</div>} />
          </Routes>
        </main>
        {/* 푸터는 항상 콘텐츠 아래에 위치 */}
      </div>
      <Footer />
    </Router>
  );
};

export default App;
