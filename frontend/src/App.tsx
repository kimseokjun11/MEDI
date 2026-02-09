import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import PublicData from './pages/PublicData';
import Board from './pages/Board';
import Signup from './pages/Signup';
import Login from './pages/Login';
import FindId from './pages/FindId';
import BoardWrite from './pages/BoardWrite';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';

import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  // ✅ 새로고침(F5) 시 로그인 상태 복구
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLogin');
    if (savedLogin === 'true') {
      setIsLogin(true);
    }
  }, []);

  // ✅ 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    setIsLogin(false);
    navigate('/');
  };

  return (
    <div className="app">
      {/* ✅ 로그인 후에만 상단 바 표시 */}
      {isLogin && (
        <nav className="top-nav">
          <div className="logo">
            <NavLink to="/home">💊 MEDI</NavLink>
          </div>

          <div className="nav-links">
            <NavLink to="/home">홈</NavLink>
            <NavLink to="/public-data">공지사항</NavLink>
            <NavLink to="/board">게시판</NavLink>
            <NavLink to="/medicine">약정보</NavLink>

            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </nav>
      )}

      <Routes>
        {/* 시작 페이지 (로그인) */}
        <Route path="/" element={<Login setIsLogin={setIsLogin} />} />

        {/* 로그인 관련 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-id" element={<FindId />} />

        {/* 로그인 후 페이지 */}
        <Route path="/home" element={<Home />} />
        <Route path="/public-data" element={<PublicData />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />
      </Routes>
    </div>
  );
}

// ✅ BrowserRouter 분리 (권장 구조)
export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
