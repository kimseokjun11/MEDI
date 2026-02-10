import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardWrite.css';

const BoardWrite = () => {
  const navigate = useNavigate();
  const loginUser = localStorage.getItem('loginUser'); // 로그인한 아이디

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!loginUser) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    try {
      // ✅ 진짜 서버로 전송
      await axios.post('http://localhost:8080/api/boards', {
        title: title,
        content: content,
        writer: loginUser
      });
      alert('글이 등록되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error(error);
      alert('글 등록 실패!');
    }
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
        <div className="boardwrite-actions">
          <button className="boardwrite-btn cancel" onClick={() => navigate('/board')}>
            취소
          </button>
          <button className="boardwrite-btn submit" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardWrite;