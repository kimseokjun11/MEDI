import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Member.css';

const EditProfile = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  // ✅ 키 이름을 'loginUser'로 수정했습니다.
  const userid = localStorage.getItem('loginUser');

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:8080/api/members/update', { userid, password, email });
      alert('수정되었습니다.');
      navigate('/mypage');
    } catch {
      alert('수정 실패');
    }
  };

  return (
    <div className="member-page-container">
      <h1 className="member-page-title">정보 수정</h1>
      <div className="member-input-group"><label>새 이메일</label><input type="email" onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="member-input-group"><label>새 비밀번호</label><input type="password" onChange={(e) => setPassword(e.target.value)} /></div>
      <button className="btn-update" onClick={handleUpdate}>저장하기</button>
      <button className="btn-cancel" onClick={() => navigate('/mypage')}>취소</button>
    </div>
  );
};

export default EditProfile;