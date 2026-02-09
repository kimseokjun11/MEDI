import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/members';

// 회원가입
export const createMember = async (username: string, password: string, name: string) => {
  try {
    await axios.get(BASE_URL, {
      params: { action: 'create', username, password, name }
    });
    return true;
  } catch (error) {
    console.error('회원가입 실패:', error);
    return false;
  }
};

