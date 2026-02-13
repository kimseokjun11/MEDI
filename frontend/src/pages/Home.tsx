import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/Home.css";
import type { DurItem } from '../api/dur';
import { checkDurTaboo, searchDurItems } from '../api/dur';
import ChatBot from "../pages/ChatBot";

// 인기 검색
const popularSearches = ["타이레놀", "판콜", "비타민C"];

type AgeKey = "10대" | "20대" | "30대" | "40대" | "50대+" | "전체";

type RecommendSlide = {
  title: string;
  subtitle?: string;
  items: { name: string; reason?: string }[];
};

const SUPPLEMENT_RECOMMENDS: Record<AgeKey, RecommendSlide[]> = {
  "10대": [
    {
      title: "10대 기본 추천",
      subtitle: "성장·면역 밸런스",
      items: [
        { name: "비타민D", reason: "실내생활 많으면 도움" },
        { name: "아연", reason: "면역·피부 케어" },
        { name: "오메가3", reason: "식단이 불규칙하면 보완" },
      ],
    },
  ],
  "20대": [
    {
      title: "20대 추천",
      subtitle: "피로·활력",
      items: [
        { name: "비타민B군", reason: "피로감/에너지 대사" },
        { name: "마그네슘", reason: "근육 긴장·수면" },
        { name: "비타민C", reason: "항산화·면역" },
      ],
    },
    {
      title: "20대 추천",
      subtitle: "눈·피부",
      items: [
        { name: "루테인", reason: "장시간 화면 사용" },
        { name: "콜라겐", reason: "피부 보습/탄력" },
        { name: "비오틴", reason: "모발·손톱" },
      ],
    },
  ],
  "30대": [
    {
      title: "30대 추천",
      subtitle: "기초 건강 관리",
      items: [
        { name: "오메가3", reason: "혈행·지질 관리" },
        { name: "비타민D", reason: "뼈·면역" },
        { name: "루테인", reason: "눈 피로" },
      ],
    },
    {
      title: "30대 추천",
      subtitle: "장·면역",
      items: [
        { name: "유산균", reason: "장 건강" },
        { name: "아연", reason: "면역 밸런스" },
        { name: "비타민C", reason: "항산화" },
      ],
    },
  ],
  "40대": [
    {
      title: "40대 추천",
      subtitle: "관절·혈행",
      items: [
        { name: "오메가3", reason: "혈행 관리" },
        { name: "코엔자임Q10", reason: "항산화·활력" },
        { name: "비타민D", reason: "골 건강" },
      ],
    },
    {
      title: "40대 추천",
      subtitle: "뼈·근육",
      items: [
        { name: "칼슘", reason: "골밀도" },
        { name: "마그네슘", reason: "근육/신경" },
        { name: "비타민K2", reason: "칼슘 이용" },
      ],
    },
  ],
  "50대+": [
    {
      title: "50대+ 추천",
      subtitle: "뼈·눈·활력",
      items: [
        { name: "칼슘", reason: "골 건강" },
        { name: "루테인", reason: "노화 관련 눈 건강" },
        { name: "코엔자임Q10", reason: "활력/항산화" },
      ],
    },
  ],
  "전체": [
    {
      title: "기본 추천",
      subtitle: "대부분에 무난한 조합",
      items: [
        { name: "비타민D", reason: "결핍이 흔함" },
        { name: "오메가3", reason: "혈행/지질" },
        { name: "마그네슘", reason: "수면/근육" },
      ],
    },
  ],
};

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

  // 🔍 DUR 자동완성(서버 검색) 리스트
  const [suggestions, setSuggestions] = useState<DurItem[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [durLoading, setDurLoading] = useState(false);

  // 자동검색 관련
  const [search, setSearch] = useState("");
  const [selectedFromList, setSelectedFromList] = useState(false);

  /* ✅ (5) 추천 영양제 상태: 연령대 선택 + 슬라이드 */
  const [ageKey, setAgeKey] = useState<AgeKey>("20대");
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo(() => {
    const byAge = SUPPLEMENT_RECOMMENDS[ageKey];
    return (byAge && byAge.length > 0) ? byAge : SUPPLEMENT_RECOMMENDS["전체"];
  }, [ageKey]);

  // 슬라이드 자동 넘김
  useEffect(() => {
    setSlideIndex(0);
  }, [ageKey]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  // localStorage에서 복구
  useEffect(() => {
    const saved = localStorage.getItem("myMedicines");
    if (saved) setMyMedicines(JSON.parse(saved));
  }, []);

  // 모달 열릴 때 초기값 세팅
  useEffect(() => {
    if (isModalOpen) {
      if (editingMed !== null) {
        const med = myMedicines[editingMed];
        setSearch(med.name);
        setSelectedFromList(!!med.isVerified);
        setSelectedDrugCode(med.drugCode ?? null);
      } else {
        setSearch("");
        setSelectedFromList(false);
        setSelectedDrugCode(null);
      }
    }
  }, [isModalOpen, editingMed, myMedicines]);

  // 🔍 DUR 자동완성: 모달에서 약 이름을 입력할 때 서버에서 검색
  useEffect(() => {
    // 모달이 열려있을 때만 검색
    if (!isModalOpen) return;

    // 이미 리스트에서 선택된 상태면 (정확히 선택됨) 재검색 안함
    if (selectedFromList) {
      setSuggestions([]);
      return;
    }

    const q = search.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSuggestLoading(true);
        const data = await searchDurItems(q, 20);
        setSuggestions(data);
      } catch (e) {
        console.error('DUR 자동완성 검색 실패', e);
        setSuggestions([]);
      } finally {
        setIsSuggestLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedFromList, isModalOpen]);

  // ✅ 등록된 약(2개 이상)일 때 병용금기(DUR) 체크
  useEffect(() => {
    const valid = myMedicines
      .filter((m) => m?.drugCode)
      .map((m) => String(m.drugCode)); // drugCode에 ITEM_SEQ 저장

    if (valid.length < 2) {
      setInteractions([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setDurLoading(true);
        const result = await checkDurTaboo(valid);
        if (!cancelled) setInteractions(result);
      } catch (e) {
        console.error('DUR 병용금기 체크 실패', e);
        if (!cancelled) setInteractions([]);
      }
      finally {
        if (!cancelled) setDurLoading(false); // 로딩 종료
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [myMedicines]);

  // 저장
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
    localStorage.setItem("myMedicines", JSON.stringify(updated));
    setIsModalOpen(false);
    setEditingMed(null);
  };

  // 삭제
  const deleteMedicine = (idx: number) => {
    const updated = myMedicines.filter((_, i) => i !== idx);
    setMyMedicines(updated);
    localStorage.setItem("myMedicines", JSON.stringify(updated));
    setIsDeleteModalOpen(false);
    setEditingMed(null);
  };

  // ✅ 영양제 클릭 시: 네이버 쇼핑 링크(그냥 링크만, API 아님)
  const openShopping = (q: string) => {
    window.open(
      `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="home">
      {/* 히어로 */}
      <section className="hero">
        <h1>💊 이 약, 같이 먹어도 될까?</h1>
        <p>시중 약 기준 · 음식 · 약물 상호작용 한 번에 확인</p>
        <button className="btn" onClick={() => navigate("/medicine")}>
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
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      onClick={() => {
                        setEditingMed(idx);
                        setIsModalOpen(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{med.name}</strong>
                      {!med.isVerified && (
                        <span style={{ color: "orange", marginLeft: "6px" }}>
                          ⚠️
                        </span>
                      )}
                      {" "}· {med.dose} · 하루 {med.frequency}회
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

              {/* ⏳ DUR 로딩 중 */}
              {durLoading && (
                <div className="interactions loading">
                  ⏳ 상호작용 정보를 검색 중입니다...
                </div>
              )}

              {/* ⚠ 상호작용 있음 */}
              {!durLoading && interactions.length > 0 && (
                <div className="interactions warning">
                  <h4>⚠️ 상호작용 주의</h4>
                  <ul>
                    {interactions.map((i, idx) => (
                      <li key={idx}>
                        <strong>{i.withDrug}</strong> ({i.level}): {i.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ 병용금기 없음 */}
              {!durLoading &&
                myMedicines.filter((m) => m?.drugCode).length >= 2 &&
                interactions.length === 0 && (
                  <div className="interactions safe">
                    ✅ 현재 선택된 약 조합에서 확인된 병용금기 정보가 없습니다.
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
            style={{ marginTop: "12px" }}
          >
            등록
          </button>
        </div>

        {/* ✅ (5) 하드코딩 추천 영양제 카드 */}
        <div className="card caution slider-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>🎯 추천 영양제</h3>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
                추천 · 연령대별
              </p>
            </div>

            <select
              value={ageKey}
              onChange={(e) => setAgeKey(e.target.value as AgeKey)}
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "white",
                fontSize: "14px",
              }}
            >
              <option value="10대">10대</option>
              <option value="20대">20대</option>
              <option value="30대">30대</option>
              <option value="40대">40대</option>
              <option value="50대+">50대+</option>
              <option value="전체">전체</option>
            </select>
          </div>

          {/* 슬라이더 */}
          <div className="slider-wrapper" style={{ marginTop: "12px" }}>
            <div
              className="slider-track"
              style={{
                transform: `translateX(-${slideIndex * 100}%)`,
              }}
            >
              {slides.map((slide, idx) => (
                <div className="slide" key={idx}>
                  <h4 style={{ margin: "0 0 6px" }}>
                    {slide.title}
                  </h4>
                  {slide.subtitle && (
                    <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: "13px" }}>
                      {slide.subtitle}
                    </p>
                  )}

                  {slide.items.map((it, i) => (
                    <button
                      key={i}
                      type="button"
                      className="supplement-link"
                      onClick={() => openShopping(it.name)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "10px 12px",
                        marginBottom: "8px",
                        cursor: "pointer",
                      }}
                      title={it.reason ?? ""}
                    >
                      💊 {it.name}
                      {it.reason && (
                        <span style={{ display: "block", color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                          {it.reason}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 슬라이더 dots + 버튼 */}
          {slides.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {slides.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: i === slideIndex ? "#2563eb" : "#cbd5e1",
                      cursor: "pointer",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                  style={{
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#e2e8f0",
                    cursor: "pointer",
                  }}
                >
                  이전
                </button>
                <button
                  type="button"
                  onClick={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
                  style={{
                    padding: "6px 10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#e2e8f0",
                    cursor: "pointer",
                  }}
                >
                  다음
                </button>
              </div>
            </div>
          )}
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

      {/* 등록 / 수정 모달 */}
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
                    setSelectedDrugCode(null);
                  }}
                  placeholder="약 이름 검색"
                />
              </label>


              {/* 자동검색 리스트 지울 수 있음*/}
              {isSuggestLoading && (
                <p style={{ marginTop: '6px', fontSize: '0.85rem' }}>검색 중...</p>
              )}

              {search && suggestions.length > 0 && (
                <ul
                  style={{
                    maxHeight: "160px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    marginTop: "6px",
                    padding: "4px",
                  }}
                >
                  {suggestions.map((d, idx) => (
                    <li
                      key={idx}
                      style={{ padding: "6px", cursor: "pointer" }}
                      onClick={() => {
                        setSearch(d.itemName);
                        setSelectedFromList(true);
                        setSelectedDrugCode(d.itemSeq);
                        setSuggestions([]);
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{d.itemName}</div>
                      {d.entpName && (
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{d.entpName}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {search && !selectedFromList && !isSuggestLoading && suggestions.length === 0 && (
                <p style={{ color: 'orange', fontSize: '0.85rem' }}>
                  ⚠️ 검색 목록에 없는 약입니다. 정확하지 않을 수 있어요.
                </p>
              )}

              {/* <label>
                복용량
                <input
                  name="dose"
                  placeholder="예: 1정"
                  defaultValue={editingMed !== null ? myMedicines[editingMed].dose : ""}
                />
              </label> */}

              {/* <label>
                복용 횟수
                <select
                  name="frequency"
                  defaultValue={editingMed !== null ? myMedicines[editingMed].frequency : "1"}
                >
                  <option value="1">하루 1회</option>
                  <option value="2">하루 2회</option>
                  <option value="3">하루 3회</option>
                </select>
              </label> */}

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
