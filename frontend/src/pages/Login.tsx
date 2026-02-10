// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // ⭐ 이게 꼭 있어야 함!
// import '../styles/Login.css';

// interface LoginProps {
//   setIsLogin: (value: boolean) => void;
// }

// const Login = ({ setIsLogin }: LoginProps) => {
//   const navigate = useNavigate();

//   const [userid, setUserid] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     if (!userid || !password) {
//       setError('아이디와 비밀번호를 입력해주세요.');
//       return;
//     }

//     // 👇 여기가 핵심! "서버로 보내는 코드"가 있어야 합니다.
//     try {
//       const response = await axios.post('http://localhost:8080/api/members/login', {
//         userid: userid,
//         password: password
//       });

//       // 백엔드가 "OK(200)"라고 했을 때만 로그인 성공!
//       if (response.status === 200) {
//         console.log("로그인 성공:", response.data);
//         localStorage.setItem('isLogin', 'true');
//         localStorage.setItem('loginUser', userid);
//         setIsLogin(true);
//         setError('');
//         navigate('/home');
//       }
//     } catch (err) {
//       console.error(err);
//       // 실패하면 에러 메시지 띄우고 로그인 안 시켜줌!
//       setError('아이디 또는 비밀번호가 틀렸습니다!'); 
//     }
//   };

//   return (
//     <div className="login-wrapper">
//       <div className="login-card">
//         <h2 className="login-title">로그인</h2>
//         <input className="login-input" placeholder="아이디" value={userid} onChange={(e) => setUserid(e.target.value)} />
//         <input className="login-input" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
//         {error && <div className="login-error">{error}</div>}
//         <button className="login-button" onClick={handleLogin}>로그인</button>
//         <div className="login-links">
//           <button className="login-link" onClick={() => navigate('/find-id')}>아이디 찾기</button>
//           <button className="login-link" onClick={() => navigate('/signup')}>회원가입</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

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
    // ✅ 입력값 체크
    if (!userid || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 🔥 1️⃣ 임시 관리자 로그인 (최우선)
    if (userid === 'admin' && password === 'admin123') {
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('loginUser', 'admin');
      localStorage.setItem('userRole', 'ADMIN');

      setIsLogin(true);
      setError('');
      navigate('/admin'); // 👉 관리자 대시보드
      return;
    }

    // 🔥 2️⃣ 일반 사용자 로그인 (기존 DB 로직)
    try {
      const response = await axios.post(
        'http://localhost:8080/api/members/login',
        {
          userid,
          password,
        }
      );

      if (response.status === 200) {
        console.log('로그인 성공:', response.data);

        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('loginUser', userid);
        localStorage.setItem('userRole', 'USER'); // 일반 사용자

        setIsLogin(true);
        setError('');
        navigate('/home');
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
          <button
            className="login-link"
            onClick={() => navigate('/find-id')}
          >
            아이디 찾기
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
