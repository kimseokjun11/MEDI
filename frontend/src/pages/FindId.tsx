import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ⭐ 통신 도구 추가
import '../styles/FindId.css'; // 기존 스타일 유지

const FindId = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState(''); // 찾은 아이디 저장
  const [error, setError] = useState('');

  const handleFindId = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      // ⭐ 백엔드에 이메일 보내서 아이디 물어보기
      const response = await axios.post('http://localhost:8080/api/members/find-id', {
        email: email
      });

      if (response.status === 200) {
        // 성공하면 받아온 아이디를 화면에 보여줌
        setFoundId(response.data);
        setError('');
      }
    } catch (err) {
      console.error(err);
      setFoundId('');
      setError('가입된 정보가 없습니다. 이메일을 확인해주세요.');
    }
  };

  return (
    <div className="findid-wrapper">
      <div className="findid-card">
        <h2 className="findid-title">아이디 찾기</h2>

        {/* 1. 아이디를 찾기 전: 입력창 보여주기 */}
        {!foundId ? (
          <>
            <p className="findid-desc">
              가입 시 사용한 이메일을 입력하시면<br />
              아이디를 알려드립니다.
            </p>

            <input
              className="findid-input"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <div className="findid-error">{error}</div>}

            <button className="findid-button" onClick={handleFindId}>
              아이디 찾기
            </button>
          </>
        ) : (
          /* 2. 아이디를 찾은 후: 결과 보여주기 */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>
              회원님의 아이디는 아래와 같습니다.
            </p>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#2563eb', 
              background: '#eff6ff', 
              padding: '15px', 
              borderRadius: '10px',
              marginBottom: '20px' 
            }}>
              {foundId}
            </div>
            <button className="findid-button" onClick={() => navigate('/')}>
              로그인하러 가기
            </button>
          </div>
        )}

        <div className="findid-link">
          <button onClick={() => navigate('/')}>
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindId;