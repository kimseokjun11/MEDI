import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Member.css'; 

const MyPage = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  // ✅ 키 이름을 'loginUser'로 수정했습니다.
  const userid = localStorage.getItem('loginUser');

  useEffect(() => {
    if (!userid) {
      navigate('/');
      return;
    }
    axios.get(`http://localhost:8080/api/members/me?userid=${userid}`)
      .then(res => setUser(res.data))
      .catch(() => alert("정보 로드 실패"));
  }, [userid, navigate]);

  if (!user) return <div className="member-page-container">로딩 중...</div>;

  return (
    <div className="member-page-container">
      <h1 className="member-page-title">마이페이지</h1>
      <div className="member-info-box">
        <div className="member-info-row"><span className="label">아이디</span><span className="value">{user.userid}</span></div>
        <div className="member-info-row"><span className="label">이메일</span><span className="value">{user.email}</span></div>
      </div>
      <button className="btn-update" onClick={() => navigate('/edit-profile')}>정보 수정</button>
    </div>
  );
};

export default MyPage;