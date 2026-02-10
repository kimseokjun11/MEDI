import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import '../styles/BoardDetail.css';

interface BoardData {
  id: number;
  title: string;
  writer: string;
  content: string;
  date: string;
  viewCount: number;
}

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginUser = localStorage.getItem('loginUser');
  const [post, setPost] = useState<BoardData | null>(null);

  // ✅ 서버에서 게시글 1개 가져오기
  useEffect(() => {
    axios.get(`http://localhost:8080/api/boards/${id}`)
      .then(response => setPost(response.data))
      .catch(() => alert('존재하지 않는 게시글입니다.'));
  }, [id]);

  // ✅ 삭제하기 (진짜 삭제)
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/boards/${id}`);
      alert('삭제되었습니다.');
      navigate('/board');
    } catch (error) {
      alert('삭제 실패!');
    }
  };

  if (!post) return <div className="boarddetail-wrapper">로딩 중...</div>;

  return (
    <div className="boarddetail-wrapper">
      <div className="boarddetail-card">
        <h2 className="boarddetail-title">{post.title}</h2>
        <div className="boarddetail-info">
          <span>작성자: {post.writer}</span>
          <span>날짜: {post.date ? post.date.substring(0, 10) : ''}</span>
          <span>조회수: {post.viewCount}</span>
        </div>
        <div className="boarddetail-content">
          {post.content}
        </div>

        {/* 댓글 컴포넌트 */}
        <CommentSection postId={post.id} />

        <div className="boarddetail-actions">
          <button onClick={() => navigate('/board')}>목록으로</button>
          {loginUser === post.writer && (
            <>
              <button className="edit" onClick={() => navigate(`/board/edit/${post.id}`)}>
                수정
              </button>
              <button className="delete" onClick={handleDelete}>
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