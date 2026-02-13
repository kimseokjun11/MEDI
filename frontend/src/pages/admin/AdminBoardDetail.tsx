import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminBoardDetail.css';

const AdminBoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    // 1. 게시글 정보 가져오기
    axios.get(`http://localhost:8080/api/boards/${id}`)
      .then(res => setBoard(res.data))
      .catch(err => {
        alert("게시글을 불러올 수 없습니다.");
        navigate('/admin/board');
      });

    // 2. 댓글 목록 가져오기
    axios.get(`http://localhost:8080/api/comments/board/${id}`)
      .then(res => setComments(res.data))
      .catch(err => console.error(err));
  }, [id, navigate]);

  // 댓글 삭제 로직 (관리자 권한)
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("관리자 권한으로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`);
      alert("댓글이 삭제되었습니다.");
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert("댓글 삭제 실패!");
    }
  };

  if (!board) return <div className="loading">데이터 로딩 중...</div>;

  return (
    <div className="admin-detail-wrapper">
      <h2>🛠️ 게시글 및 댓글 관리 (관리자)</h2>
      
      <div className="board-content-card">
        <div className="board-info">
          <h3>{board.title}</h3>
          <p>작성자: <strong>{board.writer}</strong> | 조회수: {board.viewCount}</p>
        </div>
        <hr />
        <div className="board-body">{board.content}</div>
      </div>

      <div className="comment-management-section">
        <h4>💬 전체 댓글 관리 ({comments.length}개)</h4>
        <table className="comment-admin-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>작성자</th>
              <th>내용</th>
              <th style={{ width: '60px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {comments.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: '600' }}>{c.writer}</td>
                <td>{c.content}</td>
                <td>
                  <button className="comment-del-btn" onClick={() => handleDeleteComment(c.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="admin-actions">
        <button className="back-list-btn" onClick={() => navigate('/admin/board')}>목록으로</button>
      </div>
    </div>
  );
};

export default AdminBoardDetail;