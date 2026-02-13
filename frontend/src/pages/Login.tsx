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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ⭐ form 기본 새로고침 방지

    if (!userid || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/members/login',
        {
          userid,
          password,
        }
      );

      if (response.status === 200 && response.data) {
        const member = response.data;

        // ✅ 로그인 정보 저장
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('loginUser', member.userid);
        localStorage.setItem('userRole', member.role);

        setIsLogin(true);
        setError('');

        // ✅ 관리자 분기
        if (member.role === 'ADMIN') {
          navigate('/admin');
        } else {
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

        {/* ✅ form 추가 */}
        <form onSubmit={handleLogin}>
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

          {/* ✅ submit 버튼 */}
          <button className="login-button" type="submit">
            로그인
          </button>
        </form>

        <div className="login-links">
          <button
            className="login-link"
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
          </button>

          <button
            className="login-link"
            onClick={() => navigate('/find-password')}
          >
            비밀번호 찾기
          </button>

          <button
            className="login-link"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
