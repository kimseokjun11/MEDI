import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardDetail.css';

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
    <div className="boarddetail-wrapper">

      {/* 제목 */}
      <h2>
        {post.secret && '🔒 '}
        {post.title}
      </h2>

      {/* 작성 정보 */}
      <div className="boarddetail-info">
        작성자: {post.writer} | 작성일: {post.date?.substring(0, 10)}
      </div>

      {/* 본문 */}
      <div className="boarddetail-content">
        {post.content}
      </div>

      {/* ================= 관리자 답변 입력 영역 ================= */}
      {userRole === 'ADMIN' && (
        <div style={{ marginTop: '40px' }}>
          <h3>관리자 답변</h3>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            style={{ width: '100%', height: '120px' }}
          />

          <button
            style={{ marginTop: '10px' }}
            onClick={handleAnswerSubmit}
          >
            답변 등록
          </button>
        </div>
      )}

      {/* ================= 기존 답변 표시 ================= */}
      {post.answer && userRole !== 'ADMIN' && (
        <div style={{ marginTop: '40px' }}>
          <h3>관리자 답변</h3>

          <div
            style={{
              background: '#f1f5f9',
              padding: '15px',
              borderRadius: '8px',
            }}
          >
            {post.answer}
          </div>
        </div>
      )}

      {/* ================= 댓글 영역 ================= */}
      {!post.secret && (
        <div style={{ marginTop: '40px' }}>
          <h3>댓글</h3>

          {post.comments?.length === 0 && (
            <div style={{ color: '#888' }}>
              댓글이 없습니다.
            </div>
          )}

          {post.comments?.map((c) => (
            <div key={c.id} style={{ marginBottom: '10px' }}>
              <strong>{c.writer}</strong> : {c.content}
            </div>
          ))}

          {loginUser && (
            <>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                style={{
                  width: '100%',
                  height: '80px',
                  marginTop: '10px',
                }}
              />

              <button
                style={{ marginTop: '10px' }}
                onClick={handleCommentSubmit}
              >
                댓글 등록
              </button>
            </>
          )}
        </div>
      )}

      {/* 목록 버튼 */}
      <div style={{ marginTop: '40px' }}>
        <button onClick={() => navigate('/qna')}>
          목록으로
        </button>
      </div>
    </div>
  );
};

export default QnaDetail;
