import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ⭐ 통신 도구 다시 추가
import '../styles/BoardWrite.css';

const BoardWrite = () => {
  const navigate = useNavigate();

  // 로그인한 사용자 아이디 가져오기
  const loginUser = localStorage.getItem('loginUser');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // 1. 로그인 체크 (비로그인시 튕겨냄)
    if (!loginUser) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login'); // 로그인 창으로 보내기
      return;
    }

    // 2. 입력값 검사
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      // 3. ⭐ 가짜 console.log 지우고 진짜 백엔드로 전송!
      await axios.post('http://localhost:8080/api/boards', {
        title: title,
        content: content,
        writer: loginUser // 작성자에 현재 로그인한 ID 넣기
      });

      alert('게시글이 등록되었습니다!');
      navigate('/board'); // 목록으로 이동

    } catch (error) {
      console.error('글쓰기 실패:', error);
      alert('글 등록에 실패했습니다.');
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
          placeholder="내용을 자유롭게 작성해주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="boardwrite-actions">
          <button className="boardwrite-btn cancel" onClick={() => navigate('/board')}>
            취소
          </button>
          <button className="boardwrite-btn submit" onClick={handleSubmit}>
            등록 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardWrite;