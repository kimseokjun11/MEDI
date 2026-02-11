import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../../styles/Admin.css';

interface Board {
  id: number;
  title: string;
  writer: string;
  date: string;
  viewCount: number;
}

const AdminBoard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Board[]>([]);

  // 1. 게시글 목록 불러오기
  const fetchPosts = () => {
    axios.get('http://localhost:8080/api/admin/boards')
      .then(res => {
        // ID 역순(최신순) 정렬
        const sorted = res.data.sort((a: Board, b: Board) => b.id - a.id);
        setPosts(sorted);
      })
      .catch(err => console.error("게시글 로딩 실패", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 2. 관리자 권한으로 삭제하기
  const handleDelete = async (id: number) => {
    if (!window.confirm(`${id}번 게시글을 정말 삭제하시겠습니까? (복구 불가)`)) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/boards/${id}`);
      alert('삭제되었습니다.');
      fetchPosts(); // 목록 새로고침
    } catch (err) {
      console.error(err);
      alert('삭제 실패!');
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">📋 게시판 관리</h2>
      
      <div className="admin-box">
        <div style={{ marginBottom: '10px', color: '#6b7280' }}>
          총 {posts.length}개의 게시글이 있습니다.
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', width: '60px' }}>No</th>
              <th>제목</th>
              <th style={{ width: '120px' }}>작성자</th>
              <th style={{ width: '120px' }}>작성일</th>
              <th style={{ width: '80px', textAlign: 'center' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{post.id}</td>
                
                {/* 제목 클릭하면 해당 글(상세페이지)로 이동해서 내용 확인 가능하게 */}
                <td 
                  style={{ cursor: 'pointer', fontWeight: '500', color: '#1f2937' }}
                  onClick={() => navigate(`/board/${post.id}`)}
                >
                  {post.title}
                </td>
                
                <td>{post.writer}</td>
                <td style={{ color: '#6b7280' }}>
                  {post.date ? post.date.substring(0, 10) : '-'}
                </td>
                
                <td style={{ textAlign: 'center' }}>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBoard;