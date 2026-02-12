import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Board.css';

interface QnaData {
  id: number;
  title: string;
  writer: string;
  date: string;
  secret: boolean;
  answered: boolean;
}

const QnaList = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<QnaData[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/qna', {
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
        console.error('QnA 로딩 실패', error);
      });
  }, [page, searchKeyword]);

  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <h2>Q&A 게시판</h2>

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
            onClick={() => navigate('/qna/write')}
          >
            질문하기
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
            <th>상태</th>
          </tr>
        </thead>

        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '30px' }}>
                질문이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1 + page * 10}</td>

                <td
                  className="board-title"
                  onClick={() => navigate(`/qna/${post.id}`)}
                >
                  {post.secret && '🔒 '}
                  {post.title}
                </td>

                <td>{post.writer}</td>
                <td>{post.date?.substring(0, 10)}</td>

                <td>
                  {post.answered ? (
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>
                      답변완료
                    </span>
                  ) : (
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                      대기중
                    </span>
                  )}
                </td>
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

export default QnaList;
