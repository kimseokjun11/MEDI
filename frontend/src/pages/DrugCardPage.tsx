import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DrugCard.css";
import TopToggle from "../pages/TopToggle";   // ✅ 추가

interface Drug {
  itemName: string;
  entpName: string;
  efcyQesitm: string;
}

export default function DrugCardPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchAllDrugs();
  }, []);

  const fetchAllDrugs = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/drug?itemName=`
      );
      const data = await res.json();
      setDrugs(data || []);
    } catch (error) {
      console.error("초기 로딩 오류:", error);
    }
    setLoading(false);
  };

  const searchDrug = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/drug?itemName=${encodeURIComponent(search)}`
      );
      const data = await res.json();
      setDrugs(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("검색 오류:", error);
      setDrugs([]);
    }
    setLoading(false);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = drugs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(drugs.length / itemsPerPage);

  return (
    <div className="drug-page-container">

      {/* ✅ 제목 + 토글 */}
      <div className="drug-top">
        <h1 className="drug-title">💊 약 정보 검색</h1>
        <TopToggle />
      </div>

      <div className="drug-search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="약 이름을 입력하세요..."
          onKeyDown={(e) => e.key === "Enter" && searchDrug()}
        />
        <button onClick={searchDrug}>검색</button>
      </div>

      {loading && <p className="drug-empty">검색 중...</p>}

      <div className="drug-grid">
        {currentItems.map((drug, index) => (
          <div
            key={index}
            className="drug-card"
            onClick={() =>
              navigate(`/drug-detail/${encodeURIComponent(drug.itemName)}`)
            }
            style={{ cursor: "pointer" }}
          >
            <h2>{drug.itemName}</h2>
            <p className="drug-company">{drug.entpName}</p>
            <p className="drug-effect">{drug.efcyQesitm}</p>
          </div>
        ))}
      </div>

      {!loading && drugs.length === 0 && (
        <p className="drug-empty">검색 결과가 없습니다.</p>
      )}

      {totalPages > 1 && (
        <div className="drug-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}