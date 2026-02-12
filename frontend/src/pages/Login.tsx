import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

interface LoginProps {
  setIsLogin: (value: boolean) => void;
}

const Login = ({ setIsLogin }: LoginProps) => {
  const navigate = useNavigate();

  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async () => {
  if (!userid || !password) {
    setError('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/members/login', {
      userid: userid,
      password: password
    });

    if (response.status === 200 && response.data) {
      const member = response.data; 

      // ✅ 키값을 'loginUser'로 유지하여 게시판 등 다른 페이지와 연동합니다.
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('loginUser', member.userid); 
      localStorage.setItem('userRole', member.role);    

      setIsLogin(true);
      setError('');

// ✅ [추가] 관리자 여부에 따른 리다이렉트 분기
      if (member.role === 'ADMIN') {
        // 관리자라면 관리자 대시보드로 이동
        navigate('/admin'); 
      } else {
        // 일반 유저라면 홈으로 이동
        navigate('/home'); 
      }
    }
  } catch (err) {
    console.error(err);
    setError('아이디 또는 비밀번호가 틀렸습니다!');
  }
};

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">로그인</h2>

        <input
          className="login-input"
          placeholder="아이디"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <div className="login-links">
          <button className="login-link" onClick={() => navigate('/find-id')}>
            아이디 찾기
          </button>
          <button className="login-link" onClick={() => navigate('/find-password')}>
            비밀번호 찾기
          </button>
          <button className="login-link" onClick={() => navigate('/signup')}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;