import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommentSection.css';

interface Comment {
  id: number;
  writer: string;
  content: string;
  date: string;
}

interface Props {
  postId: number;
}

const CommentSection = ({ postId }: Props) => {
  const loginUser = localStorage.getItem('loginUser');
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');

  // 수정 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 1. 댓글 불러오기 (서버 연동)
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/board/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 로딩 실패", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 2. 댓글 작성
  const handleAddComment = async () => {
    if (!content.trim()) return;
    if (!loginUser) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/comments', {
        boardId: postId.toString(),
        writer: loginUser,
        content: content
      });
      setContent('');
      fetchComments(); // 목록 새로고침
    } catch (err) {
      console.error(err);
      alert('댓글 등록 실패');
    }
  };

  // 3. 댓글 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('삭제하시겠습니까?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/comments/${id}`);
      fetchComments();
    } catch (err) {
      alert('삭제 실패');
    }
  };

  // 4. 댓글 수정 저장
  const handleEditSave = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/api/comments/${id}`, {
        content: editingContent
      });
      setEditingId(null);
      fetchComments();
    } catch (err) {
      alert('수정 실패');
    }
  };

  return (
    <div className="comment-wrapper">
      <h3 className="comment-title">💬 댓글 ({comments.length})</h3>

      <div className="comment-list">
        {comments.length === 0 && (
          <div className="comment-empty">아직 댓글이 없습니다.</div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-top">
              <div className="comment-meta">
                <span className="comment-writer">{comment.writer}</span>
                {/* 날짜 형식 자르기 */}
                <span className="comment-date">
                  {comment.date ? comment.date.substring(0, 10) : ''}
                </span>
              </div>

              {/* 작성자 본인일 때만 버튼 표시 */}
              {loginUser === comment.writer && (
                <div className="comment-actions">
                  <button onClick={() => {
                      setEditingId(comment.id);
                      setEditingContent(comment.content);
                  }}>수정</button>
                  <button className="delete" onClick={() => handleDelete(comment.id)}>삭제</button>
                </div>
              )}
            </div>

            {/* 수정 모드 vs 보기 모드 */}
            {editingId === comment.id ? (
              <div className="comment-edit-box">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="edit-buttons">
                  <button onClick={() => handleEditSave(comment.id)}>저장</button>
                  <button className="cancel" onClick={() => setEditingId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <div className="comment-content">{comment.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className="comment-input-box">
        <textarea
          placeholder={loginUser ? "댓글을 입력하세요" : "로그인이 필요합니다"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!loginUser}
        />
        <button onClick={handleAddComment} disabled={!loginUser}>등록</button>
      </div>
    </div>
  );
};

export default CommentSection;