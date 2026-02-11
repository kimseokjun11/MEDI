import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../../styles/Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // 통계 데이터를 저장할 상태변수
  const [stats, setStats] = useState({
    memberCount: 0,
    adminBoardCount: 0,
    userBoardCount: 0
  });

  // 화면 켜지자마자 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/stats')
      .then(res => {
        setStats(res.data); // 받아온 데이터 { memberCount: 5, boardCount: 3 } 저장
      })
      .catch(err => console.error("통계 로딩 실패", err));
  }, []);

  return (
    <div className="admin-page">
      <h2 className="admin-title">🛠 관리자 대시보드</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <p>총 회원 수</p>
          {/* 진짜 데이터 연결 */}
          <h3>{stats.memberCount}명</h3>
        </div>
        <div className="stat-card">
          <p>총 게시글</p>
          {/* 진짜 데이터 연결 */}
          <h3>{stats.adminBoardCount + stats.userBoardCount}개</h3>
          <span style = {{ fontSize: '14px', color: '#6b7280'}}>
            관리자 {stats.adminBoardCount} / 일반 {stats.userBoardCount}
          </span>
        </div>
        <div className="stat-card">
          <p>시스템 상태</p>
          <h3 style={{color:'#10b981'}}>정상 운영 중</h3>
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