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

  // ✅ 기존 데이터 불러오기
  useEffect(() => {
    axios.get(`http://localhost:8080/api/boards/${id}`)
      .then(res => {
        if (res.data.writer !== loginUser) {
          alert('수정 권한이 없습니다.');
          navigate('/board');
        } else {
          setTitle(res.data.title);
          setContent(res.data.content);
        }
      })
      .catch(() => navigate('/board'));
  }, [id, loginUser, navigate]);

  // ✅ 수정사항 저장 (PUT)
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/boards/${id}`, {
        title: title,
        content: content
      });
      alert('수정 완료!');
      navigate(`/board/${id}`);
    } catch (error) {
      alert('수정 실패');
    }
  };

  return (
    <div className="boardedit-wrapper">
      <h2 className="boardedit-title">게시글 수정</h2>
      <div className="boardedit-card">
        <input className="boardedit-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="boardedit-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="boardedit-actions">
          <button className="cancel" onClick={() => navigate(`/board/${id}`)}>취소</button>
          <button className="submit" onClick={handleUpdate}>수정 완료</button>
        </div>
      </div>
    </div>
  );
};

export default BoardEdit;