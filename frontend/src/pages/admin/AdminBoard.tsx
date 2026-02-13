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

  const fetchPosts = () => {
    // 관리자 전용 게시글 전체 조회 API 호출
    axios.get('http://localhost:8080/api/admin/boards')
      .then(res => {
        const sorted = res.data.sort((a: Board, b: Board) => b.id - a.id);
        setPosts(sorted);
      })
      .catch(err => console.error("게시글 로딩 실패", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm(`${id}번 게시글을 정말 삭제하시겠습니까?`)) return;
    try {
      // 관리자 권한 게시글 삭제 API
      await axios.delete(`http://localhost:8080/api/admin/boards/${id}`);
      alert('삭제되었습니다.');
      fetchPosts();
    } catch (err) {
      alert('삭제 실패!');
    }
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">📋 게시판 관리</h2>
      <div className="admin-box">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f3f4f6', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', width: '60px' }}>No</th>
              <th>제목 (클릭 시 상세 관리)</th>
              <th style={{ width: '120px' }}>작성자</th>
              <th style={{ width: '80px', textAlign: 'center' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{post.id}</td>
                <td 
                  style={{ cursor: 'pointer', fontWeight: '500', color: '#2563eb' }}
                  onClick={() => navigate(`/admin/board/${post.id}`)} // 👈 관리자 전용 상세창으로 이동
                >
                  {post.title}
                </td>
                <td>{post.writer}</td>
                <td style={{ textAlign: 'center' }}>
                  <button className="btn-delete-red" onClick={() => handleDelete(post.id)}>삭제</button>
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