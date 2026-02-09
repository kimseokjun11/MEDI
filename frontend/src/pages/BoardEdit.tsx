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
  const [writer, setWriter] = useState('');
  const [error, setError] = useState('');

  // ✅ 기존 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/boards/${id}`
        );

        const post = response.data;

        // 🔐 작성자 체크 (프론트 기준)
        if (post.writer !== loginUser) {
          alert('수정 권한이 없습니다.');
          navigate('/board');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setWriter(post.writer);
      } catch (err) {
        console.error(err);
        alert('게시글을 불러오지 못했습니다.');
        navigate('/board');
      }
    };

    fetchPost();
  }, [id, loginUser, navigate]);

  // ✅ 수정 저장
  const handleUpdate = async () => {
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/boards/${id}`, {
        title,
        content,
        userid: loginUser, // 🔥 서버에서 권한 체크용
      });

      alert('게시글이 수정되었습니다.');
      navigate(`/board/${id}`);
    } catch (err) {
      console.error(err);
      alert('수정 권한이 없거나 오류가 발생했습니다.');
    }
  };

  return (
    <div className="boardedit-wrapper">
      <h2 className="boardedit-title">✏️ 게시글 수정</h2>

      <div className="boardedit-card">
        <input
          className="boardedit-input"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="boardedit-textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {error && <div className="boardedit-error">{error}</div>}

        <div className="boardedit-actions">
          <button
            className="cancel"
            onClick={() => navigate(`/board/${id}`)}
          >
            취소
          </button>

          <button
            className="submit"
            onClick={handleUpdate}
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEdit;
