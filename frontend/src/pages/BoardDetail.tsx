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
  const loginUser = localStorage.getItem('loginUser'); // 현재 로그인한 사람
  const userRole = localStorage.getItem('userRole');   // 관리자 여부 확인용

  const [post, setPost] = useState<BoardData | null>(null);

  // 게시글 내용 불러오기
  useEffect(() => {
    axios.get(`http://localhost:8080/api/boards/${id}`)
      .then(response => setPost(response.data))
      .catch(error => {
        console.error(error);
        alert('존재하지 않거나 삭제된 게시글입니다.');
        navigate('/board');
      });
  }, [id, navigate]);

  // 삭제
  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/boards/${id}`);
      alert('삭제되었습니다.');
      navigate('/board');
    } catch (error) {
      console.error(error);
      alert('삭제 실패! 권한이 없거나 오류가 발생했습니다.');
    }
  };

  if (!post) return <div className="boarddetail-wrapper">로딩 중...</div>;

  // 수정/삭제 권한 설정(본인 + 관리자)
  const canEdit = (loginUser === post.writer) || (userRole === 'ADMIN');

  return (
    <div className="boarddetail-wrapper">
      <div className="boarddetail-card">
        <h2 className="boarddetail-title">{post.title}</h2>
        <div className="boarddetail-info">
          <span>작성자: {post.writer}</span>
          <span>날짜: {post.date ? post.date.substring(0, 10) : ''}</span>
          <span>조회수: {post.viewCount}</span>
        </div>
        
        {/* 본문 내용 */}
        <div className="boarddetail-content" style={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>

        {/*  댓글 연결 */}
        <CommentSection postId={post.id} />

        <div className="boarddetail-actions">
          <button onClick={() => navigate('/board')}>목록으로</button>
          
          {canEdit && (
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