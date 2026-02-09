import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 👈 통신 도구
import '../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const [error, setError] = useState('');

  const handleSignup = async () => {
    // 1. 입력값 검증
    if (!email || !userid || !password || !confirm || !age || !gender) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 2. ⭐ 진짜 백엔드 서버(8080)로 데이터 전송
    try {
      const response = await axios.post('http://localhost:8080/api/members/signup', {
        userid: userid,       // 백엔드 엔티티 변수명과 일치해야 함
        password: password,
        email: email,
        age: Number(age),     // 숫자로 변환해서 전송
        gender: gender
      });

      if (response.status === 200 || response.status === 201) {
        alert('회원가입 성공! 로그인해주세요.');
        navigate('/'); // 로그인 화면으로 이동
      }
    } catch (err) {
      console.error("회원가입 에러:", err);
      setError('회원가입 실패! (이미 존재하는 아이디일 수 있습니다)');
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">회원가입</h2>
        
        {/* 입력 UI는 그대로 유지 */}
        <input className="signup-input" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="signup-input" placeholder="아이디" value={userid} onChange={(e) => setUserid(e.target.value)} />
        <input className="signup-input" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="signup-input" type="password" placeholder="비밀번호 확인" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <div className="signup-row">
          <input className="signup-input" placeholder="나이" value={age} onChange={(e) => setAge(e.target.value)} />
          <select className="signup-select" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">성별</option>
            <option value="M">남</option>
            <option value="F">여</option>
          </select>
        </div>

        {error && <div className="signup-error">{error}</div>}

        <button className="signup-button" onClick={handleSignup}>회원가입</button>

        <div className="signup-link">
          <button onClick={() => navigate('/')}>로그인 페이지로 돌아가기</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;