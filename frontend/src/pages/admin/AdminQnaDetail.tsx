import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminQnaDetail.css';

interface QnaDetailData {
  id: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  secret: boolean;
  answered: boolean;
  answer?: string;
}

const AdminQnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<QnaDetailData | null>(null);
  const [answer, setAnswer] = useState('');

  /* ================= 글 불러오기 ================= */
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/qna/${id}`)
      .then((res) => {
        setPost(res.data);
        setAnswer(res.data.answer || '');
      })
      .catch((err) => {
        console.error('QnA 로딩 실패', err);
        alert('존재하지 않는 글입니다.');
        navigate('/admin/qna');
      });
  }, [id, navigate]);

  if (!post) return null;

  /* ================= 답변 등록 ================= */
  const handleAnswerSubmit = async () => {
    if (!answer.trim()) {
      alert('답변 내용을 입력하세요.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/admin/qna/${id}/answer`,
        {
          content: answer,
        }
      );

      alert('답변이 등록되었습니다.');
      navigate('/admin/qna');
    } catch (err) {
      console.error('답변 등록 실패', err);
      alert('답변 등록 실패');
    }
  };

  return (
    <div className="admin-qna-detail-wrapper">
      <div className="admin-qna-title">
        {post.secret && '🔒 '} {post.title}
      </div>

      <div className="admin-qna-info">
        작성자: {post.writer} | 작성일: {post.date?.substring(0, 10)}
      </div>

      <div className="admin-qna-content">
        {post.content}
      </div>

      {/* ===== 기존 답변 ===== */}
      {post.answered && post.answer && (
        <div className="admin-answer-box">
          <strong>기존 답변</strong>
          <div style={{ marginTop: '8px' }}>{post.answer}</div>
        </div>
      )}

      {/* ===== 답변 작성 ===== */}
      <div className="admin-answer-section">
        <h3>관리자 답변</h3>

        <textarea
          className="admin-answer-textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력하세요..."
        />

        <div className="admin-answer-actions">
          <button
            className="admin-btn primary"
            onClick={handleAnswerSubmit}
          >
            답변 등록
          </button>

          <button
            className="admin-btn secondary"
            onClick={() => navigate('/admin/qna')}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminQnaDetail;
