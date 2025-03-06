import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "@/components/Header/Header";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<p className="text-4xl font-bold text-blue-500 mt-4 h-100%">메인페이지</p>} />
        {/* 다른 라우트 추가 가능 */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
