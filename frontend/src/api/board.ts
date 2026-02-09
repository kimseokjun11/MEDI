import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/boards';

// 게시글 목록 조회
export const getBoardList = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('목록 조회 실패:', error);
    return [];
  }
};

// 게시글 생성
export const createBoard = async (title: string, content: string, writer: string) => {
  try {
    await axios.post(BASE_URL, { title, content, writer });
    return true;
  } catch (error) {
    console.error('게시글 생성 실패:', error);
    return false;
  }
};
