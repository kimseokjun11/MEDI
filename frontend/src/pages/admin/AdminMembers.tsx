// src/pages/admin/AdminMembers.tsx
import './../../styles/Admin.css';

const AdminMembers = () => {
  return (
    <div className="admin-page">
      <h2 className="admin-title">👤 회원 관리</h2>

      <div className="admin-box">
        <p>회원 목록 조회</p>
        <p>(추후 권한 관리 / 강제 탈퇴 기능 확장 가능)</p>
      </div>
    </div>
  );
};

export default AdminMembers;
