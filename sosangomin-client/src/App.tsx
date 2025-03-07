import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<p className="text-4xl font-bold text-blue-500 mt-4 h-100%">메인페이지</p>} />
        <Route path="/login" />
        <Route path="/signup" />
        <Route path="/reset-password" />
        <Route path="/mypage" />
        <Route path="/community/notice" />
        <Route path="/community/notice/post/:postId" />
        <Route path="/community/news" />
        <Route path="/community/board" />
        <Route path="/community/board/write" />
        <Route path="/community/board/edit" />
        <Route path="/community/board/post/:postId" />
        <Route path="/data-analysis/upload" />
        <Route path="/data-analysis/insight" />
        <Route path="/data-analysis/review-insight" />
        <Route path="/data-analysis/advise" />
        <Route path="/map" />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
