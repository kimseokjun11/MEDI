import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardWrite.css';

const QnaWrite = () => {
  const navigate = useNavigate();

  const loginUser = localStorage.getItem('loginUser');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [secret, setSecret] = useState(false); // ⭐ 비밀글 상태

  const handleSubmit = async () => {
    // 로그인 체크
    if (!loginUser) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    // 입력값 체크
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/qna',
        {
          title: title,
          content: content,
          writer: loginUser,
          secret: secret   // ⭐ 비밀글 여부 추가
        },
      );

      alert('질문이 등록되었습니다!');
      navigate('/qna');

    } catch (error) {
      console.error('질문 등록 실패:', error);
      alert('질문 등록에 실패했습니다.');
    }
  };

  return (
    <div className="boardwrite-wrapper">
      <h2 className="boardwrite-title">❓ 질문 작성</h2>

      <div className="boardwrite-card">
        <input
          className="boardwrite-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="boardwrite-textarea"
          placeholder="궁금한 내용을 자유롭게 작성해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* ⭐ 비밀글 체크박스 */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '14px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={secret}
              onChange={() => setSecret(!secret)}
              style={{ marginRight: '6px' }}
            />
            비밀글로 작성하기
          </label>
        </div>

        <div className="boardwrite-actions">
          <button
            className="boardwrite-btn cancel"
            onClick={() => navigate('/qna')}
          >
            취소
          </button>

          <button
            className="boardwrite-btn submit"
            onClick={handleSubmit}
          >
            등록 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default QnaWrite;
