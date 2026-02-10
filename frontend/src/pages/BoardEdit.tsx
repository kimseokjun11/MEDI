// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../styles/BoardEdit.css';

// const BoardEdit = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const loginUser = localStorage.getItem('loginUser');

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [writer, setWriter] = useState('');
//   const [error, setError] = useState('');

//   // ✅ 기존 게시글 불러오기
//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/boards/${id}`
//         );

//         const post = response.data;

//         // 🔐 작성자 체크 (프론트 기준)
//         if (post.writer !== loginUser) {
//           alert('수정 권한이 없습니다.');
//           navigate('/board');
//           return;
//         }

//         setTitle(post.title);
//         setContent(post.content);
//         setWriter(post.writer);
//       } catch (err) {
//         console.error(err);
//         alert('게시글을 불러오지 못했습니다.');
//         navigate('/board');
//       }
//     };

//     fetchPost();
//   }, [id, loginUser, navigate]);

//   // ✅ 수정 저장
//   const handleUpdate = async () => {
//     if (!title || !content) {
//       setError('제목과 내용을 모두 입력해주세요.');
//       return;
//     }

//     try {
//       await axios.put(`http://localhost:8080/api/boards/${id}`, {
//         title,
//         content,
//         userid: loginUser, // 🔥 서버에서 권한 체크용
//       });

//       alert('게시글이 수정되었습니다.');
//       navigate(`/board/${id}`);
//     } catch (err) {
//       console.error(err);
//       alert('수정 권한이 없거나 오류가 발생했습니다.');
//     }
//   };

//   return (
//     <div className="boardedit-wrapper">
//       <h2 className="boardedit-title">✏️ 게시글 수정</h2>

//       <div className="boardedit-card">
//         <input
//           className="boardedit-input"
//           placeholder="제목"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <textarea
//           className="boardedit-textarea"
//           placeholder="내용"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />

//         {error && <div className="boardedit-error">{error}</div>}

//         <div className="boardedit-actions">
//           <button
//             className="cancel"
//             onClick={() => navigate(`/board/${id}`)}
//           >
//             취소
//           </button>

//           <button
//             className="submit"
//             onClick={handleUpdate}
//           >
//             수정 완료
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardEdit;





//임시 코드
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BoardEdit.css';

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const loginUser = localStorage.getItem('loginUser');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [writer, setWriter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 🔥 이미 수정된 데이터 있으면 사용
    const edited = localStorage.getItem(`editedPost-${id}`);
    if (edited) {
      const post = JSON.parse(edited);
      setTitle(post.title);
      setContent(post.content);
      setWriter(post.writer);
      return;
    }

    // 더미 게시글
    const dummyPosts = [
      {
        id: 1,
        title: '영양제 같이 먹어도 될까요?',
        writer: 'user01',
        content: '비타민C랑 오메가3 같이 먹어도 괜찮은지 궁금합니다.',
      },
      {
        id: 2,
        title: '비타민C 복용 시간 질문',
        writer: 'user02',
        content: '비타민C는 아침에 먹는 게 좋은가요?',
      },
    ];

    const post = dummyPosts.find((p) => p.id === Number(id));

    if (!post) {
      alert('게시글을 찾을 수 없습니다.');
      navigate('/board');
      return;
    }

    // ✅ 임시 권한 완화 (hong 허용)
    if (post.writer !== loginUser && loginUser !== 'hong') {
      alert('수정 권한이 없습니다.');
      navigate('/board');
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    setWriter(post.writer);
  }, [id, loginUser, navigate]);

  // ✅ 수정 저장 (임시)
  const handleUpdate = () => {
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const editedPost = {
      id: Number(id),
      title,
      content,
      writer,
      date: new Date().toISOString().slice(0, 10),
    };

    localStorage.setItem(
      `editedPost-${id}`,
      JSON.stringify(editedPost)
    );

    alert('게시글이 수정되었습니다. (임시)');
    navigate(`/board/${id}`);
  };

  return (
    <div className="boardedit-wrapper">
      <h2 className="boardedit-title">✏️ 게시글 수정</h2>

      <div className="boardedit-card">
        <input
          className="boardedit-input"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="boardedit-textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {error && <div className="boardedit-error">{error}</div>}

        <div className="boardedit-actions">
          <button
            className="cancel"
            onClick={() => navigate(`/board/${id}`)}
          >
            취소
          </button>

          <button
            className="submit"
            onClick={handleUpdate}
          >
            수정 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEdit;

