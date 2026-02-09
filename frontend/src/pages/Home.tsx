import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // CSS 파일 따로 분리

// 예시 데이터 (실제로는 API나 state에서 불러옴)
const myMedicines = [
  
];

const cautionList = [
  '감기약 + 술 ❌',
  '진통제 + 커피 ❌',
];

const popularSearches = ['타이레놀', '판콜', '비타민C'];

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* 히어로 섹션 */}
      <section className="hero">
        <h1>💊 이 약, 같이 먹어도 될까?</h1>
        <p>시중 약 기준 · 음식 · 약물 상호작용 한 번에 확인</p>
        <button className="btn" onClick={() => navigate('/medicine')}>
          약 검색하기 →
        </button>
      </section>

      {/* 카드 그리드 */}
      <section className="card-grid">

        {/* 내 복용 약 카드 */}
        <div className="card">
          <h3>📝 내 복용 약</h3>
          {myMedicines.length === 0 ? (
            <p>등록된 약이 없습니다</p>
          ) : (
            <ul>
              {myMedicines.map((med, idx) => (
                <li key={idx}>
                  <strong>{med.name}</strong> - {med.dosage} ({med.method})
                </li>
              ))}
            </ul>
          )}
          <button className="btn" onClick={() => navigate('/medicine')}>
            등록 / 수정
          </button>
        </div>

        {/* 주의 조합 카드 */}
        <div className="card caution">
          <h3>⚠️ 주의 조합</h3>
          <ul>
            {cautionList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 인기 검색 카드 */}
        <div className="card">
          <h3>📊 요즘 많이 검색</h3>
          <ul>
            {popularSearches.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

      </section>

      {/* 안내 */}
      <div className="warning">
        ⚠️ 본 서비스는 참고용이며 복용 전 전문가 상담을 권장합니다
      </div>

    </div>
  );
}

export default Home;