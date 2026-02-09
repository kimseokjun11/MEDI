import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindId.css';

const FindId = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFindId = () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      setSuccess(false);
      return;
    }

    // ✅ 실제로는 서버에 이메일 보내서 아이디 조회
    setError('');
    setSuccess(true);
  };

  return (
    <div className="findid-wrapper">
      <div className="findid-card">
        <h2 className="findid-title">아이디 찾기</h2>

        <p className="findid-desc">
          가입 시 사용한 이메일을 입력하시면<br />
          아이디를 안내해드립니다.
        </p>

        <input
          className="findid-input"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <div className="findid-error">{error}</div>}

        {success && (
          <div className="findid-success">
            입력하신 이메일로 아이디 안내를 전송했습니다.
          </div>
        )}

        <button className="findid-button" onClick={handleFindId}>
          아이디 찾기
        </button>

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
