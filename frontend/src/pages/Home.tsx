import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';

// 인기 검색
const popularSearches = ['타이레놀', '판콜', '비타민C'];

function Home() {
  const navigate = useNavigate();

  // 내 복용 약
  const [myMedicines, setMyMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // 🔹 localStorage에서 복구
  useEffect(() => {
    const saved = localStorage.getItem('myMedicines');
    if (saved) setMyMedicines(JSON.parse(saved));
  }, []);

  // 🔹 저장
  const saveMedicines = (data) => {
    let updated;
    if (editingMed !== null) {
      updated = myMedicines.map((m, i) => (i === editingMed ? data : m));
    } else {
      updated = [...myMedicines, data];
    }
    setMyMedicines(updated);
    localStorage.setItem('myMedicines', JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingMed(null);
  };

  // 🔹 삭제
  const deleteMedicine = (idx) => {
    const updated = myMedicines.filter((_, i) => i !== idx);
    setMyMedicines(updated);
    localStorage.setItem('myMedicines', JSON.stringify(updated));
    setIsDeleteModalOpen(false);
    setEditingMed(null);
  };

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
          <h3>📝 내 복용 약</h3>
          {myMedicines.length === 0 ? (
            <p>등록된 약이 없습니다</p>
          ) : (
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
                    <strong>{med.name}</strong> · {med.dose} · 하루 {med.frequency}회
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
          )}

          <button
            className="btn"
            onClick={() => {
              setEditingMed(null);
              setIsModalOpen(true);
            }}
          >
            등록 / 수정
          </button>
        </div>

        {/* 추천 영양제 */}
        <div className="card caution">
          <h3>🎯 20대 추천 영양제</h3>
          <ul>
            <li>
              <a href="https://search.shopping.naver.com/search/all?query=비타민B군" target="_blank" rel="noreferrer">
                💊 비타민 B군
              </a>
            </li>
            <li>
              <a href="https://search.shopping.naver.com/search/all?query=비타민C" target="_blank" rel="noreferrer">
                🍊 비타민 C
              </a>
            </li>
            <li>
              <a href="https://search.shopping.naver.com/search/all?query=오메가3" target="_blank" rel="noreferrer">
                🧠 오메가3
              </a>
            </li>
            <li>
              <a href="https://search.shopping.naver.com/search/all?query=마그네슘" target="_blank" rel="noreferrer">
                😴 마그네슘
              </a>
            </li>
          </ul>
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
                const formData = new FormData(e.target);
                saveMedicines(Object.fromEntries(formData));
              }}
            >
              <label>
                약 이름 *
                <input
                  name="name"
                  required
                  defaultValue={editingMed !== null ? myMedicines[editingMed].name : ''}
                />
              </label>

              <label>
                복용량
                <input
                  name="dose"
                  placeholder="예: 1정"
                  defaultValue={editingMed !== null ? myMedicines[editingMed].dose : ''}
                />
              </label>

              <label>
                복용 횟수
                <select
                  name="frequency"
                  defaultValue={editingMed !== null ? myMedicines[editingMed].frequency : '1'}
                >
                  <option value="1">하루 1회</option>
                  <option value="2">하루 2회</option>
                  <option value="3">하루 3회</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  취소
                </button>
                <button type="submit" className="btn">
                  저장
                </button>
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
              <button type="button" onClick={() => setIsDeleteModalOpen(false)}>
                취소
              </button>
              <button
                type="button"
                className="btn btn-delete-modal"
                onClick={() => deleteMedicine(editingMed)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;