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

  // ✅ 서버에서 게시글 목록 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/api/boards')
      .then(response => {
        // 최신글(ID가 큰 순서)이 위로 오게 정렬
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
          {/* 검색 기능은 나중에 구현, 일단 UI만 유지 */}
          <input className="board-search" placeholder="제목 또는 작성자 검색" />
          <button className="board-btn">검색</button>
          
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
                게시글이 없습니다. 첫 글을 남겨보세요!
              </td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr key={post.id}>
                {/* 🔢 보여주는 번호는 깔끔하게 계산 (전체개수 - 현재인덱스) */}
                <td>{posts.length - index}</td>
                
                <td className="board-title" onClick={() => navigate(`/board/${post.id}`)}>
                  {post.title}
                  {/* 댓글 수 표시하고 싶으면 여기에 추가 가능 */}
                </td>
                <td>{post.writer}</td>
                {/* 날짜 깔끔하게 자르기 (YYYY-MM-DD) */}
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