import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BoardWrite.css';

const BoardWrite = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // ✅ 나중에 여기서 Spring API로 POST
    console.log({ title, content });

    alert('글이 등록되었습니다.');
    navigate('/board');
  };

  return (
    <div className="boardwrite-wrapper">
      <h2 className="boardwrite-title">✍️ 글쓰기</h2>

      <div className="boardwrite-card">
        <input
          className="boardwrite-input"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="boardwrite-textarea"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {error && <div className="boardwrite-error">{error}</div>}

        <div className="boardwrite-actions">
          <button
            className="boardwrite-btn cancel"
            onClick={() => navigate('/board')}
          >
            목록으로
          </button>

          <button
            className="boardwrite-btn submit"
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardWrite;
