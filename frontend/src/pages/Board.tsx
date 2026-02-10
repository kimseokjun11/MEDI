import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Board.css';

interface BoardData {
  id: number;
  title: string;
  writer: string;
  date: string;
  viewCount: number;
}

const Board = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BoardData[]>([]);

  // ✅ 서버에서 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/boards')
      .then(response => {
        // 최신글이 위로 오게 정렬 (ID 역순)
        const sorted = response.data.sort((a: BoardData, b: BoardData) => b.id - a.id);
        setPosts(sorted);
      })
      .catch(error => {
        console.error("게시글 로딩 실패", error);
      });
  }, []);

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <h2>📋 게시판</h2>
        <div className="board-actions">
          <button className="board-btn primary" onClick={() => navigate('/board/write')}>
            글쓰기
          </button>
        </div>
      </div>

      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5} style={{textAlign:'center', padding:'30px'}}>
                게시글이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post, index) => ( // 👈 index(순서)를 활용
            <tr key={post.id}>
              {/* 👇 전체 개수에서 현재 순서를 빼면, 항상 꽉 찬 번호가 나옵니다! */}
              <td>{posts.length - index}</td>
              <td className="board-title" onClick={() => navigate(`/board/${post.id}`)}>
                {post.title}
                </td>
                <td>{post.writer}</td>
                <td>{post.date ? post.date.substring(0, 10) : '-'}</td>
                <td>{post.viewCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Board;