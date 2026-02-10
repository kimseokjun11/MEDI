// src/pages/admin/AdminBoard.tsx
import './../../styles/Admin.css';

const AdminBoard = () => {
  return (
    <div className="admin-page">
      <h2 className="admin-title">📋 게시판 관리</h2>

      <div className="admin-box">
        <p>※ 관리자 권한으로 게시글 / 댓글을 관리할 수 있습니다.</p>
        <p>(현재는 게시판 DB 연동 전 단계)</p>
      </div>
    </div>
  );
};

export default AdminBoard;
