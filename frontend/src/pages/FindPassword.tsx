import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // 로그인 스타일 재사용

const FindPassword = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');

  const handleFindPw = async () => {
    if (!userid || !email) return alert('아이디와 이메일을 모두 입력해주세요.');

    try {
      // 로딩 중 표시 대신 간단히 alert
      alert('잠시만 기다려주세요... 메일을 보내는 중입니다.');
      
      const res = await axios.post('http://localhost:8080/api/members/find-password', {
        userid,
        email
      });

      if (res.status === 200) {
        alert('이메일로 임시 비밀번호를 보냈습니다! 메일함을 확인해주세요.');
        navigate('/'); // 로그인 화면으로 이동
      }
    } catch (err) {
      alert('일치하는 회원 정보가 없거나 전송에 실패했습니다.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">비밀번호 찾기</h2>
        <p style={{textAlign:'center', marginBottom:'20px', fontSize:'14px', color:'#666'}}>
          가입하신 아이디와 이메일을 입력하시면<br/>임시 비밀번호를 보내드립니다.
        </p>

        <input className="login-input" placeholder="아이디" value={userid} onChange={(e)=>setUserid(e.target.value)} />
        <input className="login-input" placeholder="이메일" value={email} onChange={(e)=>setEmail(e.target.value)} />
        
        <button className="login-button" onClick={handleFindPw}>임시 비밀번호 발송</button>

        <div className="login-links" style={{justifyContent:'center'}}>
            <button className="login-link" onClick={() => navigate('/')}>로그인 하러 가기</button>
        </div>
      </div>
    </div>
  );
};
export default FindPassword;