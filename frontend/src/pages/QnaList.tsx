import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/QnaUser.css';

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
  <div className="qna-container">
    <div className="board-header">
      <h2>❓ Q&A 고객지원</h2>
      <div className="board-actions">
        <input className="board-search" placeholder="궁금한 내용을 검색하세요" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <button className="board-btn primary" onClick={handleSearch}>검색</button>
        <button className="board-btn primary" onClick={() => navigate('/qna/write')}>문의하기</button>
      </div>
    </div>

    <table className="board-table">
      <thead>
        <tr>
          <th>번호</th>
          <th>질문 제목</th>
          <th>상태</th>
          <th>작성일</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td className="board-title" onClick={() => navigate(`/qna/${post.id}`)}>
              {post.secret && '🔒 '} {post.title}
            </td>
            <td>
              <span className={`qna-badge ${post.answered ? 'done' : 'wait'}`}>
                {post.answered ? '답변완료' : '답변대기'}
              </span>
            </td>
            <td style={{ color: '#94a3b8' }}>{post.date?.substring(0, 10)}</td>
          </tr>
        ))}
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
