import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ⭐ 이게 꼭 있어야 함!
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

    // 👇 여기가 핵심! "서버로 보내는 코드"가 있어야 합니다.
    try {
      const response = await axios.post('http://localhost:8080/api/members/login', {
        userid: userid,
        password: password
      });

      // 백엔드가 "OK(200)"라고 했을 때만 로그인 성공!
      if (response.status === 200) {
        console.log("로그인 성공:", response.data);
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('loginUser', userid);
        setIsLogin(true);
        setError('');
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      // 실패하면 에러 메시지 띄우고 로그인 안 시켜줌!
      setError('아이디 또는 비밀번호가 틀렸습니다!'); 
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">로그인</h2>
        <input className="login-input" placeholder="아이디" value={userid} onChange={(e) => setUserid(e.target.value)} />
        <input className="login-input" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="login-error">{error}</div>}
        <button className="login-button" onClick={handleLogin}>로그인</button>
        <div className="login-links">
          <button className="login-link" onClick={() => navigate('/find-id')}>아이디 찾기</button>
          <button className="login-link" onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default Login;