import { useNavigate } from 'react-router-dom';
import '../styles/Board.css';

// 임시 게시글 데이터 (나중에 API로 교체)
const dummyPosts = [
  { id: 1, title: '영양제 같이 먹어도 될까요?', writer: 'user01', date: '2026-02-01' },
  { id: 2, title: '비타민C 복용 시간 질문', writer: 'user02', date: '2026-02-02' },
  { id: 3, title: '오메가3 추천 부탁드립니다', writer: 'user03', date: '2026-02-03' },
];

const Board = () => {
  const navigate = useNavigate();

  return (
    <div className="board-wrapper">
      <div className="board-header">
        <h2>📋 게시판</h2>

        <div className="board-actions">
          <input
            className="board-search"
            placeholder="제목 또는 작성자 검색"
          />
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
          </tr>
        </thead>

        <tbody>
          {dummyPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td
                className="board-title"
                onClick={() => navigate(`/board/${post.id}`)}
              >
                {post.title}
              </td>
              <td>{post.writer}</td>
              <td>{post.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
};

export default Board;
