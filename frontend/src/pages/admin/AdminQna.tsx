import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminQna.css';

interface QnaData {
  id: number;
  title: string;
  writer: string;
  secret: boolean;
  answered: boolean;
}

const AdminQna = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<QnaData[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  /* ===================== QnA 목록 불러오기 ===================== */
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
        console.error('QnA 목록 로딩 실패', error);
      });
  }, [page, searchKeyword]);

  /* ===================== 검색 ===================== */
  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(keyword);
  };

  return (
    <div className="admin-qna-wrapper">
      <h2 className="admin-qna-title">📌 Q&A 관리</h2>

      {/* ===== 검색 영역 ===== */}
      <div className="admin-qna-search">
        <input
          placeholder="제목 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button
          style={{
            marginLeft: '10px',
            padding: '8px 14px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          onClick={handleSearch}
        >
          검색
        </button>
      </div>

      {/* ===== 테이블 ===== */}
      <table className="admin-qna-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>상태</th>
          </tr>
        </thead>

        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: '30px' }}>
                질문이 없습니다.
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>

                <td
                  className="admin-qna-title-cell"
                  onClick={() => navigate(`/qna/${post.id}`)}
                >
                  {post.secret && '🔒 '}
                  {post.title}
                </td>

                <td>{post.writer}</td>

                <td>
                  {post.answered ? (
                    <span className="status-badge status-done">
                      ✅ 답변완료
                    </span>
                  ) : (
                    <span className="status-badge status-wait">
                      ❌ 미답변
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===== 페이징 ===== */}
      <div className="admin-qna-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={page === i ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminQna;
