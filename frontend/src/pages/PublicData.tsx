import { useState, useEffect } from 'react';
import { getPublicDataList } from '../api/publicData';
import type { IPublicData } from '../types';
import '../styles/PublicData.css';

const PublicData = () => {
  // 상태 관리
  const [dataList, setDataList] = useState<IPublicData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 데이터 조회 함수
  const fetchData = async () => {
    setError(null);
    
    try {
      const data = await getPublicDataList();
      setDataList(data);

      // 개발용 더미 데이터
      setDataList([
        { id: 1, title: '서울시 공공자전거 대여소 정보', description: '서울시 따릉이 대여소 위치 및 현황', category: '교통', provider: '서울특별시', updateDate: '2026-01-30' },
        { id: 2, title: '전국 관광지 정보', description: '전국 주요 관광지 상세 정보', category: '관광', provider: '한국관광공사', updateDate: '2026-01-29' },
        { id: 3, title: '실시간 대기질 정보', description: '전국 대기오염 측정 데이터', category: '환경', provider: '환경부', updateDate: '2026-01-31' },
        { id: 4, title: '전국 도서관 정보', description: '전국 공공도서관 위치 및 정보', category: '문화', provider: '문화체육관광부', updateDate: '2026-01-28' },
        { id: 5, title: '버스 노선 정보', description: '전국 버스 노선 및 정류장 정보', category: '교통', provider: '국토교통부', updateDate: '2026-01-27' },
      ]);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error(err);
    }
  };

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="public-data">
      <h1>공공데이터 조회</h1>
      <p className="page-description">
        공공데이터포털에서 제공하는 다양한 데이터를 조회할 수 있습니다.
      </p>

      {/* 결과 정보 */}
      <div className="result-info">
        총 <strong>0</strong>건의 데이터가 있습니다.
      </div>

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}

      {/* 데이터 테이블 */}
      <table className="data-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>카테고리</th>
                <th>제공기관</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td className="title-cell">
                      <strong>{item.title}</strong>
                      <p className="description">{item.description}</p>
                    </td>
                    <td>
                      <span className="category-badge">{item.category}</span>
                    </td>
                    <td>{item.provider}</td>
                    <td>{item.updateDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">
                    조회된 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="pagination">
            <button className="page-btn">
              이전
            </button>
            <span className="page-info">
              1 / 1
            </span>
            <button className="page-btn">
              다음
            </button>
          </div>
    </div>
  );
};

export default PublicData;
