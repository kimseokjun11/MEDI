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
    // 1. 입력 확인
    if (!userid || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 2. 백엔드 통신 (이제 하드코딩 없음!)
      const response = await axios.post('http://localhost:8080/api/members/login', {
        userid: userid,
        password: password
      });

      // 3. 로그인 성공 시 처리
      if (response.status === 200 && response.data) {
        const member = response.data; // 백엔드에서 받은 멤버 정보
        console.log('로그인 성공:', member);

        // 로컬 스토리지에 정보 저장
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('loginUser', member.userid);
        localStorage.setItem('userRole', member.role); // ⭐ 권한 저장 ('USER' or 'ADMIN')

        setIsLogin(true);
        setError('');

        // 4. 권한에 따라 이동하는 곳이 다름!
        if (member.role === 'ADMIN') {
          alert('관리자님 환영합니다! 👨‍💼');
          navigate('/admin'); // 관리자 대시보드로
        } else {
          alert(`${member.userid}님 환영합니다! 👋`);
          navigate('/home');  // 일반 홈으로
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
          <button className="login-link" onClick={() => navigate('/signup')}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;