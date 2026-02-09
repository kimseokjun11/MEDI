import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BoardDetail.css';

/*
  ⚠️ 현재는 게시글 상세 조회 API가 있다고 가정
  실제로는 useEffect로 서버에서 게시글 1건을 가져오는 구조로 바꾸면 됨
*/

// 임시 게시글 데이터 (※ 나중에 서버 API로 교체)
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

  // ✅ 로그인한 사용자 아이디
  const loginUser = localStorage.getItem('loginUser');

  // 임시: 게시글 찾기
  const post = dummyPosts.find((p) => p.id === Number(id));

  // 게시글 없을 때
  if (!post) {
    return (
      <div className="boarddetail-wrapper">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  // ✅ 삭제 처리 (DB 연동)
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/boards/${post.id}`, {
        params: {
          userid: loginUser, // 🔥 서버에서 작성자 검증용
        },
      });

      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error(error);
      alert('삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  return (
    <div className="boarddetail-wrapper">
      <div className="boarddetail-card">
        {/* 제목 */}
        <h2 className="boarddetail-title">{post.title}</h2>

        {/* 작성자 / 날짜 */}
        <div className="boarddetail-info">
          <span>작성자: {post.writer}</span>
          <span>작성일: {post.date}</span>
        </div>

        {/* 내용 */}
        <div className="boarddetail-content">
          {post.content}
        </div>

        {/* 버튼 영역 */}
        <div className="boarddetail-actions">
          <button onClick={() => navigate('/board')}>
            목록으로
          </button>

          {/* ✅ 작성자일 때만 수정 / 삭제 버튼 표시 */}
          {loginUser === post.writer && (
            <>
              <button
                className="edit"
                onClick={() => navigate(`/board/edit/${post.id}`)}
              >
                수정
              </button>

              <button
                className="delete"
                onClick={handleDelete}
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
