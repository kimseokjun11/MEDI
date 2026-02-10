import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import CommentSection from '../components/CommentSection';
import '../styles/BoardDetail.css';

// 더미 게시글 데이터
const dummyPosts = [
  {
    id: 1,
    title: '영양제 같이 먹어도 될까요?',
    writer: 'user01',
    date: '2026-02-01',
    content: '비타민C랑 오메가3 같이 먹어도 괜찮은지 궁금합니다.',
  },
  {
    id: 2,
    title: '비타민C 복용 시간 질문',
    writer: 'user02',
    date: '2026-02-02',
    content: '비타민C는 아침에 먹는 게 좋은가요?',
  },
];

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = localStorage.getItem('loginUser');

  // 조회수
  const [viewCount, setViewCount] = useState(0);
  const hasIncreased = useRef(false); // StrictMode 중복 방지

  // 수정된 게시글 우선 적용
  const editedPost = localStorage.getItem(`editedPost-${id}`);

  const post = editedPost
    ? JSON.parse(editedPost)
    : dummyPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="boarddetail-wrapper">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  // ✅ 조회수 증가 (정상 동작)
  useEffect(() => {
    if (hasIncreased.current) return;

    const countKey = `viewCount-${id}`;
    const newCount =
      Number(localStorage.getItem(countKey) || '0') + 1;

    localStorage.setItem(countKey, String(newCount));
    setViewCount(newCount);

    hasIncreased.current = true;
  }, [id]);

  // 임시 관리자(hong) 또는 작성자
  const canEdit =
    loginUser === post.writer || loginUser === 'hong';

  return (
    <div className="boarddetail-wrapper">
      <div className="boarddetail-card">
        {/* 제목 */}
        <h2 className="boarddetail-title">{post.title}</h2>

        {/* 정보 */}
        <div className="boarddetail-info">
          <span>작성자: {post.writer}</span>
          <span>작성일: {post.date}</span>
          <span>조회수: {viewCount}</span>
        </div>

        {/* 내용 */}
        <div className="boarddetail-content">
          {post.content}
        </div>

        {/* 댓글 영역 */}
        <CommentSection postId={post.id} />

        {/* 버튼 */}
        <div className="boarddetail-actions">
          <button onClick={() => navigate('/board')}>
            목록으로
          </button>

          {canEdit && (
            <>
              <button
                className="edit"
                onClick={() => navigate(`/board/edit/${post.id}`)}
              >
                수정
              </button>

              <button
                className="delete"
                onClick={() => {
                  if (!confirm('삭제하시겠습니까?')) return;

                  // 임시 삭제 처리
                  const deleted = JSON.parse(
                    localStorage.getItem('deletedPosts') || '[]'
                  );
                  deleted.push(post.id);

                  localStorage.setItem(
                    'deletedPosts',
                    JSON.stringify(deleted)
                  );

                  // 관련 데이터 정리
                  localStorage.removeItem(`editedPost-${id}`);
                  localStorage.removeItem(`viewCount-${id}`);
                  localStorage.removeItem(`comments-${post.id}`);

                  alert('게시글이 삭제되었습니다. (임시)');
                  navigate('/board');
                }}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardDetail;
