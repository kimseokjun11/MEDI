import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/public-data';

// 공공데이터 목록 조회
export const getPublicDataList = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('공공데이터 조회 실패:', error);
    return [];
  }
};
