import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardEdit.css';

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = localStorage.getItem('loginUser');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 기존 데이터 불러오기
  useEffect(() => {
    axios.get(`http://localhost:8080/api/boards/${id}`)
      .then(res => {
        // 본인이 쓴 글이 아니면 쫓아내기 (관리자는 예외 처리 가능)
        if (res.data.writer !== loginUser && localStorage.getItem('userRole') !== 'ADMIN') {
          alert('수정 권한이 없습니다.');
          navigate('/board');
        } else {
          setTitle(res.data.title);
          setContent(res.data.content);
        }
      })
      .catch(() => {
        alert('게시글 정보를 불러오지 못했습니다.');
        navigate('/board');
      });
  }, [id, loginUser, navigate]);

  // 수정된 내용 저장 (PUT 요청)
  const handleUpdate = async () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/boards/${id}`, {
        title: title,
        content: content
        // 작성자는 바꿀 필요 없음
      });
      alert('수정 완료!');
      navigate(`/board/${id}`); // 상세 페이지로 돌아가기
    } catch (error) {
      console.error(error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="boardedit-wrapper">
      <h2 className="boardedit-title">✏️ 게시글 수정</h2>
      <div className="boardedit-card">
        <input 
          className="boardedit-input" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="제목"
        />
        <textarea 
          className="boardedit-textarea" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="내용"
        />
        <div className="boardedit-actions">
          <button className="cancel" onClick={() => navigate(`/board/${id}`)}>취소</button>
          <button className="submit" onClick={handleUpdate}>수정 완료</button>
        </div>
      </div>
    </div>
  );
};

export default BoardEdit;