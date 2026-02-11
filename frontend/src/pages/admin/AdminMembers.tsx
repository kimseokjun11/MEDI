import { useEffect, useState } from 'react';
import axios from 'axios';
import './../../styles/Admin.css';

interface Member {
  id: number;
  userid: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // 회원 목록 가져오기
    axios.get('http://localhost:8080/api/admin/members')
      .then(res => setMembers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="admin-page">
      <h2 className="admin-title">👤 회원 관리</h2>

      <div className="admin-box">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th>아이디</th>
              <th>이메일</th>
              <th>권한</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{member.id}</td>
                <td style={{ fontWeight: 'bold' }}>{member.userid}</td>
                <td>{member.email}</td>
                <td>
                  {/* 권한에 따라 색깔 다르게 주기 */}
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: member.role === 'ADMIN' ? '#fee2e2' : '#dbeafe',
                    color: member.role === 'ADMIN' ? '#dc2626' : '#2563eb'
                  }}>
                    {member.role}
                  </span>
                </td>
                <td>{member.createdAt ? member.createdAt.substring(0, 10) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;