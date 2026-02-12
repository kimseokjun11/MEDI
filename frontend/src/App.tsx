import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import Home from './pages/Home';
import PublicData from './pages/PublicData';
import Board from './pages/Board';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindId from './pages/FindId';
import Medicine from './pages/Medicine';               
import MedicineDetail from './pages/MedicineDetail';
import QnaList from './pages/QnaList';
import QnaWrite from './pages/QnaWrite';
import QnaDetail from './pages/QnaDetail';

import AdminDashBoard from './pages/admin/AdminDashBoard';
import AdminBoard from './pages/admin/AdminBoard';
import AdminMembers from './pages/admin/AdminMembers';
import BoardWrite from './pages/BoardWrite';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from './pages/BoardEdit';

import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ admin 페이지 여부 (경로 기준)
  const isAdminPage = location.pathname.startsWith('/admin');

  // ✅ 새로고침 시 로그인 상태 복구
  useEffect(() => {
    const savedLogin = localStorage.getItem('isLogin');
    const savedRole = localStorage.getItem('userRole');

    if (savedLogin === 'true') {
      setIsLogin(true);
      setRole(savedRole);
    }
  }, []);

  // ✅ 로그아웃
  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setRole(null);
    navigate('/');
  };

  return (
    <div className="app">
      {/* ================= 관리자 네비 ================= */}
      {isLogin && isAdminPage && (
        <nav className="admin-nav">
          <div className="logo">
            💊 MEDI <span className="admin-badge">관리자</span>
          </div>

          <div className="nav-links">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              대시보드
            </NavLink>

            <NavLink
              to="/admin/board"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              게시판 관리
            </NavLink>

            <NavLink
              to="/admin/members"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              회원 관리
            </NavLink>

            <NavLink
              to="/admin/qna"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Q&A 관리
            </NavLink>


            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </nav>
      )}

      {/* ================= 일반 유저 네비 ================= */}
      {isLogin && !isAdminPage && (
        <nav className="top-nav">
          <div className="logo">💊 MEDI</div>

          <div className="nav-links">
            <NavLink to="/home">홈</NavLink>
            <NavLink to="/public-data">공지사항</NavLink>
            <NavLink to="/board">게시판</NavLink>
            <NavLink to="/medicine">약정보</NavLink>
            <NavLink to="/qna">Q&A</NavLink>

            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </nav>
      )}

      {/* ================= 라우팅 ================= */}
      <Routes>
        {/* 로그인 / 회원 */}
        <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find-id" element={<FindId />} />

        {/* 일반 유저 */}
        <Route path="/home" element={<Home />} />
        <Route path="/public-data" element={<PublicData />} />
        <Route path="/board" element={<Board />} />
        <Route path="/medicine" element={<Medicine />} />         
        <Route path="/medicine/:id" element={<MedicineDetail />} /> 

        <Route path="/board/write" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/edit/:id" element={<BoardEdit />} />

        <Route path="/qna" element={<QnaList />} />
        <Route path="/qna/write" element={<QnaWrite />} />
        <Route path="/qna/:id" element={<QnaDetail />} />

        {/* 관리자 */}
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/board" element={<AdminBoard />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        {/* <Route path="/admin/qna" element={<AdminQna />} /> */}
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
