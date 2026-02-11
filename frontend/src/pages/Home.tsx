import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';
import { drugList } from '../api/drugList';
import { checkInteractions } from '../api/checkInteractions';
import ChatBot from "../pages/ChatBot";

// 인기 검색
const popularSearches = ['타이레놀', '판콜', '비타민C'];

function Home() {
  const navigate = useNavigate();

  // 내 복용 약
  const [myMedicines, setMyMedicines] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<number | null>(null);
  const [interactions, setInteractions] = useState<
  { withDrug: string; level: string; description: string }[]
>([]);
  const [selectedDrugCode, setSelectedDrugCode] = useState<string | null>(null);

  // 🔍 자동검색 관련
  const [search, setSearch] = useState('');
  const [selectedFromList, setSelectedFromList] = useState(false);
const supplementSlides = [
  {
    age: '20대',
    items: ['비타민B군', '비타민C', '마그네슘'],
  },
  {
    age: '30대',
    items: ['오메가3', '비타민D', '루테인'],
  },
  {
    age: '40대 이상',
    items: ['칼슘', '오메가3', '코엔자임Q10'],
  },
];

const [slideIndex, setSlideIndex] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setSlideIndex((i) => (i + 1) % supplementSlides.length);
  }, 5000);
  return () => clearInterval(timer);
}, []);

  // 🔹 localStorage에서 복구
  useEffect(() => {
    const saved = localStorage.getItem('myMedicines');
    if (saved) setMyMedicines(JSON.parse(saved));
  }, []);

  // 🔹 모달 열릴 때 초기값 세팅
  useEffect(() => {
    if (isModalOpen) {
      if (editingMed !== null) {
        const med = myMedicines[editingMed];
        setSearch(med.name);
        setSelectedFromList(!!med.isVerified);
      } else {
        setSearch('');
        setSelectedFromList(false);
      }
    }
  }, [isModalOpen, editingMed, myMedicines]);

  useEffect(() => {
  console.log('myMedicines', myMedicines);
  myMedicines.forEach(m =>
  console.log(m.name, m.drugCode)
  );

  const validMedicines = myMedicines.filter(
    m => m.drugCode !== null
  );

  const result = checkInteractions(validMedicines);
  console.log('상호작용 결과', result);

  setInteractions(result);
}, [myMedicines]);

  // 🔹 저장
  const saveMedicines = (data: any) => {
    const payload = {
      ...data,
      name: search,
      drugCode: selectedDrugCode,
      isVerified: selectedFromList,
    };

    let updated;
    if (editingMed !== null) {
      updated = myMedicines.map((m, i) => (i === editingMed ? payload : m));
    } else {
      updated = [...myMedicines, payload];
    }

    setMyMedicines(updated);
    localStorage.setItem('myMedicines', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingMed(null);
  };

  // 🔹 삭제
  const deleteMedicine = (idx: number) => {
    const updated = myMedicines.filter((_, i) => i !== idx);
    setMyMedicines(updated);
    localStorage.setItem('myMedicines', JSON.stringify(updated));
    setIsDeleteModalOpen(false);
    setEditingMed(null);
  };

  // 🔍 자동검색 필터
  const filteredDrugs = drugList.filter((d) =>
    d.name.includes(search)
  );

  return (
    <div className="home">
      {/* 히어로 */}
      <section className="hero">
        <h1>💊 이 약, 같이 먹어도 될까?</h1>
        <p>시중 약 기준 · 음식 · 약물 상호작용 한 번에 확인</p>
        <button className="btn" onClick={() => navigate('/medicine')}>
          약 검색하기 →
        </button>
      </section>

      {/* 카드 그리드 */}
      <section className="card-grid">
        {/* 내 복용 약 */}
       <div className="card">
  <h3>📝 약을 같이 먹어도 될까?</h3>
  {myMedicines.length === 0 ? (
    <p>등록된 약이 없습니다</p>
  ) : (
    <>
      <ul>
        {myMedicines.map((med, idx) => (
          <li
            key={idx}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span
              onClick={() => {
                setEditingMed(idx);
                setIsModalOpen(true);
              }}
              style={{ cursor: 'pointer' }}
            >
              <strong>{med.name}</strong>
              {!med.isVerified && (
                <span style={{ color: 'orange', marginLeft: '6px' }}>⚠️</span>
              )}
              {' '}· {med.dose} · 하루 {med.frequency}회
            </span>

            <button
              className="btn-delete"
              onClick={() => {
                setEditingMed(idx);
                setIsDeleteModalOpen(true);
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>

      {/* ⚠️ 상호작용 결과 표시 */}
      {interactions.length > 0 && (
        <div
          className="interactions"
          style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#ffe6e6',
            border: '1px solid #ff4d4f',
            borderRadius: '6px',
            color: '#a80000',
          }}
        >
          <h4 style={{ margin: 0, marginBottom: '6px' }}>⚠️ 상호작용 주의</h4>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {interactions.map((i, idx) => (
              <li key={idx}>
                <strong>{i.withDrug}</strong> ({i.level}): {i.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )}

  <button
    className="btn"
    onClick={() => {
      setEditingMed(null);
      setIsModalOpen(true);
    }}
    style={{ marginTop: '12px' }}
  >
    등록 / 수정
  </button>
</div>

  <div className="card caution slider-card">
  <h3>🎯 {supplementSlides[slideIndex].age} 추천 영양제</h3>

  <div className="slider-wrapper">
    <div
      className="slider-track"
      style={{
        transform: `translateX(-${slideIndex * 100}%)`,
      }}
    >
      {supplementSlides.map((slide, idx) => (
        <div className="slide" key={idx}>
          {slide.items.map((item, i) => (
            <a
              key={i}
              href={`https://search.shopping.naver.com/search/all?query=${item}`}
              target="_blank"
              rel="noopener noreferrer"
              className="supplement-link"
            >
              💊 {item}
            </a>
          ))}
        </div>
      ))}
    </div>
  </div>
</div>

        {/* 인기 검색 */}
        <div className="card">
          <h3>📊 요즘 많이 검색</h3>
          <ul>
            {popularSearches.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="warning">
        ⚠️ 본 서비스는 참고용이며 복용 전 전문가 상담을 권장합니다
      </div>

      {/* 🔹 등록 / 수정 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>약 등록 / 수정</h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                saveMedicines(Object.fromEntries(formData));
              }}
            >
              <label>
                약 이름 *
                <input
                  required
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedFromList(false);
                  }}
                  placeholder="약 이름 검색"
                />
              </label>

              {/* 자동검색 리스트 */}
              {search && filteredDrugs.length > 0 && (
                <ul
                  style={{
                    maxHeight: '160px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginTop: '6px',
                    padding: '4px',
                  }}
                >
                  {filteredDrugs.map((d, idx) => (
                    <li
                      key={idx}
                      style={{ padding: '6px', cursor: 'pointer' }}
                     onClick={() => {
                              setSearch(d.name);
                              setSelectedFromList(true);
                              setSelectedDrugCode(d.drugCode); // ⭐ 이 줄 추가
                              }}
                             >
                      {d.name}
                    </li>
                  ))}
                </ul>
              )}

              {search && !selectedFromList && (
                <p style={{ color: 'orange', fontSize: '0.85rem' }}>
                  ⚠️ 검색 목록에 없는 약입니다. 정확하지 않을 수 있어요.
                </p>
              )}

              <label>
                복용량
                <input name="dose" placeholder="예: 1정" defaultValue={editingMed !== null ? myMedicines[editingMed].dose : ''} />
              </label>

              <label>
                복용 횟수
                <select name="frequency" defaultValue={editingMed !== null ? myMedicines[editingMed].frequency : '1'}>
                  <option value="1">하루 1회</option>
                  <option value="2">하루 2회</option>
                  <option value="3">하루 3회</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>취소</button>
                <button type="submit" className="btn">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}

      

      {/* 🔹 삭제 확인 모달 */}
      {isDeleteModalOpen && editingMed !== null && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>정말 삭제하시겠습니까?</h3>
            <p>
              <strong>{myMedicines[editingMed].name}</strong> 약 정보를 삭제합니다.
            </p>
            <div className="modal-actions">
              <button onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-delete-modal" onClick={() => deleteMedicine(editingMed)}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <ChatBot />
    </div>
  );
}

export default Home;