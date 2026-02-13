import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminQnaDetail.css';

const AdminQnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8080/api/qna/${id}`)
      .then((res) => {
        setPost(res.data);
        setAnswer(res.data.answer || '');
      })
      .catch(() => {
        alert('존재하지 않는 글입니다.');
        navigate('/admin/qna');
      });
  }, [id, navigate]);

  const handleAnswerSubmit = async () => {
    if (!answer.trim()) return alert('답변 내용을 입력하세요.');

    try {
      await axios.post(`http://localhost:8080/api/admin/qna/${id}/answer`, {
        answer: answer // 백엔드 Qna 모델의 answer 필드에 저장
      });
      alert('공식 답변이 등록되었습니다.');
      navigate('/admin/qna');
    } catch (err) {
      alert('답변 등록 실패');
    }
  };

  if (!post) return null;

  return (
    <div className="admin-qna-detail-wrapper">
      <h2 className="admin-qna-title">{post.secret && '🔒'} {post.title}</h2>
      <div className="admin-qna-info">작성자: {post.writer} | 작성일: {post.date?.substring(0, 10)}</div>
      <div className="admin-qna-content">{post.content}</div>

      <div className="admin-answer-section">
        <h3>📢 관리자 공식 답변</h3>
        <textarea
          className="admin-answer-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="사용자에게 전달할 답변을 입력하세요."
        />
        <div className="admin-answer-actions">
          <button className="admin-btn primary" onClick={handleAnswerSubmit}>
            {post.answered ? '답변 수정' : '답변 등록'}
          </button>
          <button className="admin-btn secondary" onClick={() => navigate('/admin/qna')}>목록으로</button>
        </div>
      </div>
    </div>
  );
};

export default AdminQnaDetail;