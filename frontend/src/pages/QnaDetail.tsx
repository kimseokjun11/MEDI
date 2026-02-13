import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/QnaUser.css';

interface CommentData {
  id: number;
  content: string;
  writer: string;
  date: string;
}

interface QnaDetailData {
  id: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  secret: boolean;
  answered: boolean;
  answer?: string;
  comments?: CommentData[];
}

const QnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loginUser = localStorage.getItem('loginUser');
  const userRole = localStorage.getItem('userRole');

  const [post, setPost] = useState<QnaDetailData | null>(null);
  const [comment, setComment] = useState('');
  const [answer, setAnswer] = useState('');

  /* ================== 게시글 상세 조회 ================== */
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/qna/${id}`)
      .then((res) => {
        setPost(res.data);
        setAnswer(res.data.answer || '');
      })
      .catch((err) => {
        console.error('QnA 로딩 실패', err);
        alert('접근 권한이 없거나 존재하지 않는 글입니다.');
        navigate('/qna');
      });
  }, [id, navigate]);

  if (!post) return null;

  /* ================== 비밀글 프론트 1차 방어 ================== */
  if (post.secret && loginUser !== post.writer && userRole !== 'ADMIN') {
  return (
    <div className="secret-wrapper">
      <div className="secret-card">
        <div className="secret-icon">🔒</div>
        <h2>비밀글입니다.</h2>
        <p>작성자 또는 관리자만 열람할 수 있습니다.</p>

        <button
          className="secret-btn"
          onClick={() => navigate('/qna')}
        >
          목록으로
        </button>
      </div>
    </div>
  );
}


  /* ================== 댓글 등록 ================== */
  const handleCommentSubmit = async () => {
    if (!comment) {
      alert('댓글 내용을 입력하세요.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/qna/${id}/comments`,
        {
          content: comment,
          writer: loginUser,
        }
      );

      alert('댓글이 등록되었습니다.');
      window.location.reload();
    } catch (err) {
      console.error('댓글 등록 실패', err);
      alert('댓글 등록 실패');
    }
  };

  /* ================== 관리자 답변 등록 ================== */
  const handleAnswerSubmit = async () => {
    if (!answer) {
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
      window.location.reload();
    } catch (err) {
      console.error('답변 등록 실패', err);
      alert('답변 등록 실패');
    }
  };

return (
  <div className="qna-container">
    {/* 1. 질문 카드 */}
    <div className="qna-post-card">
      <div className="qna-header-info">
        <div className="qna-title-area">
          <span className={`qna-badge ${post.answered ? 'done' : 'wait'}`} style={{marginBottom: '10px', display: 'inline-block'}}>
            {post.answered ? '답변완료' : '접수됨'}
          </span>
          <h2>{post.secret && '🔒 '} {post.title}</h2>
          <div className="qna-meta">
            작성자: <strong>{post.writer}</strong> | 일시: {post.date?.substring(0, 10)}
          </div>
        </div>
      </div>
      <div className="boarddetail-content" style={{fontSize: '16px', lineHeight: '1.8'}}>
        {post.content}
      </div>
    </div>

    {/* 2. 답변 영역 (답변이 있을 때만 표시) */}
    {post.answered && post.answer ? (
      <div className="qna-answer-wrapper">
        <div className="answer-header">
          <h3>✅ 관리자 공식 답변</h3>
        </div>
        <div className="answer-body" style={{lineHeight: '1.7', color: '#334155'}}>
          {post.answer}
        </div>
      </div>
    ) : (
      <div style={{textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8'}}>
        💬 담당자가 질문을 확인하고 있습니다. 조금만 기다려 주세요!
      </div>
    )}

    <button className="qna-btn-list" onClick={() => navigate('/qna')}>
      목록으로 돌아가기
    </button>
  </div>
);
};

export default QnaDetail;
