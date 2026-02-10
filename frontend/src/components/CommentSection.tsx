import { useEffect, useState } from 'react';
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
  const storageKey = `comments-${postId}`;

  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');

  // 수정 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // 댓글 불러오기
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, [storageKey]);

  // 댓글 작성
  const handleAddComment = () => {
    if (!content.trim()) return;

    if (!loginUser) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      writer: loginUser,
      content,
      date: new Date().toISOString().slice(0, 10),
    };

    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setContent('');
  };

  // 댓글 삭제
  const handleDelete = (id: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const filtered = comments.filter((c) => c.id !== id);
    setComments(filtered);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  };

  // 댓글 수정 저장
  const handleEditSave = (id: number) => {
    const updated = comments.map((c) =>
      c.id === id ? { ...c, content: editingContent } : c
    );

    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setEditingId(null);
    setEditingContent('');
  };

  return (
    <div className="comment-wrapper">
      <h3 className="comment-title">💬 댓글</h3>

      <div className="comment-list">
        {comments.length === 0 && (
          <div className="comment-empty">아직 댓글이 없습니다.</div>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-top">
              <div className="comment-meta">
                <span className="comment-writer">{comment.writer}</span>
                <span className="comment-date">{comment.date}</span>
              </div>

              {/* 작성자만 버튼 */}
              {loginUser === comment.writer && (
                <div className="comment-actions">
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditingContent(comment.content);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 내용 / 수정 */}
            {editingId === comment.id ? (
              <div className="comment-edit-box">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="edit-buttons">
                  <button onClick={() => handleEditSave(comment.id)}>
                    저장
                  </button>
                  <button
                    className="cancel"
                    onClick={() => setEditingId(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="comment-content">{comment.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="comment-input-box">
        <textarea
          placeholder="댓글을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddComment}>등록</button>
      </div>
    </div>
  );
};

export default CommentSection;
