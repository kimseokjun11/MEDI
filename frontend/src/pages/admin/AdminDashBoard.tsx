// src/pages/admin/AdminDashboard.tsx
import { useNavigate } from 'react-router-dom';
import './../../styles/Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <h2 className="admin-title">🛠 관리자 대시보드</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <p>총 회원 수</p>
          <h3>42명</h3>
        </div>
        <div className="stat-card">
          <p>총 게시글</p>
          <h3>128개</h3>
        </div>
        <div className="stat-card">
          <p>오늘 가입자</p>
          <h3>3명</h3>
        </div>
      </div>

      <div className="admin-actions">
        <div className="admin-card" onClick={() => navigate('/admin/board')}>
          <h3>📋 게시판 관리</h3>
          <p>게시글 / 댓글 관리</p>
        </div>

        <div className="admin-card" onClick={() => navigate('/admin/members')}>
          <h3>👤 회원 관리</h3>
          <p>회원 목록 조회</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
