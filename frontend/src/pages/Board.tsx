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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState('');      
  const [searchKeyword, setSearchKeyword] = useState('');

  // 서버 요청은 searchKeyword가 바뀔 때만 실행
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/boards', {
        params: {
          page: page,
          keyword: searchKeyword,
        },
      })
      .then((response) => {
        setPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error('게시글 로딩 실패', error);
      });
  }, [page, searchKeyword]);

  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <h2>📋 게시판</h2>

        <div className="board-actions">
          <input
            className="board-search"
            placeholder="제목 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          
          <button
            className="board-btn primary"
            onClick={handleSearch}
          >
            검색
          </button>

          <button
            className="board-btn primary"
            onClick={() => navigate('/board/write')}
          >
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
              <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
                게시글이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1 + page * 10}</td>

                <td
                  className="board-title"
                  onClick={() => navigate(`/board/${post.id}`)}
                >
                  {post.title}
                </td>

                <td>{post.writer}</td>
                <td>{post.date?.substring(0, 10)}</td>
                <td>{post.viewCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이지 버튼 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            style={{
              margin: '0 5px',
              padding: '6px 10px',
              background: page === i ? '#2563eb' : '#e5e7eb',
              color: page === i ? 'white' : '#333',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Board;
