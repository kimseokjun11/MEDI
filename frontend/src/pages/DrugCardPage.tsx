import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DrugCard.css";
import TopToggle from "../pages/TopToggle";
import axios from "axios";
import { searchDurItems } from "../api/dur";

interface Drug {
  itemSeq: string;
  itemName: string;
  entpName: string;
  materialName: string;   // ⭐ 성분
}

export default function DrugCardPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchAllDrugs();
  }, []);

  /* =========================
     ✅ 전체 목록 → DUR /all
     ========================= */
  const fetchAllDrugs = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/dur/all");
      if (!res.ok) throw new Error("전체 조회 실패");

      const data = await res.json();

      const mapped: Drug[] = data.map((d: any) => ({
        itemSeq: d.itemSeq,
        itemName: d.itemName,
        entpName: d.entpName,
        materialName: d.materialName   // ⭐ 통일
      }));

      setDrugs(mapped);
      setCurrentPage(1);

    } catch (error) {
      console.error("❌ DUR 전체 로딩 오류:", error);
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ✅ 검색 → DUR search
     ========================= */
  const searchDrug = async (keyword?: string) => {
    const q = keyword ?? search;

    if (!q.trim()) {
      fetchAllDrugs();
      return;
    }

    try {
      setLoading(true);

      const data = await searchDurItems(q);

      const mapped: Drug[] = data.map((d: any) => ({
        itemSeq: d.itemSeq,
        itemName: d.itemName,
        entpName: d.entpName,
        materialName: d.materialName   // ⭐ 통일
      }));

      setDrugs(mapped);
      setCurrentPage(1);

    } catch (error) {
      console.error("❌ DUR 검색 오류:", error);
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ✅ OCR → DUR
     ========================= */
  const analyzeImage = async () => {
    if (!selectedFile) {
      alert("이미지를 선택하세요");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/service/ocr/analyze",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const rawTexts: string[] = Array.isArray(res.data)
        ? res.data
        : res.data?.data
          ? res.data.data
          : [res.data];

      const filtered = rawTexts
        .map(t => t?.toString().trim())
        .filter(t =>
          t &&
          !t.includes("용법") &&
          !t.includes("효능") &&
          !t.includes("주의") &&
          !t.includes("보관")
        );

      if (!filtered.length) {
        alert("인식된 텍스트 없음");
        return;
      }

      const durResults = await Promise.all(
        filtered.map(text => searchDurItems(text))
      );

      const matched: Drug[] = durResults
        .map(r => r?.[0])
        .filter(Boolean)
        .map((d: any) => ({
          itemSeq: d.itemSeq,
          itemName: d.itemName,
          entpName: d.entpName,
          materialName: d.materialName   // ⭐ 통일
        }));

      if (!matched.length) {
        const fallback: Drug[] = filtered.map(text => ({
          itemSeq: crypto.randomUUID(),
          itemName: `🧾 ${text}`,
          entpName: "OCR 인식 결과",
          materialName: "성분 정보 없음"
        }));

        setDrugs(prev => [...prev, ...fallback]);
        setCurrentPage(1);
        return;
      }

      setDrugs(prev => [...prev, ...matched]);
      setCurrentPage(1);

    } catch (error) {
      console.error("❌ OCR 오류:", error);
      alert("OCR 실패");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ✅ 페이징 계산
     ========================= */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = drugs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(drugs.length / itemsPerPage);

  return (
    <div className="drug-page-container">

      <div className="drug-top">
        <h1 className="drug-title">💊 약 정보 검색 (DUR)</h1>
        <TopToggle />
      </div>

      {/* OCR */}
      {/* <div className="ocr-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedFile(file);
          }}
        />
        <button onClick={analyzeImage}>이미지 분석 (OCR)</button>
      </div> */}

      {/* 검색 */}
      <div className="drug-search-box">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="약 이름 입력..."
          onKeyDown={(e) => e.key === "Enter" && searchDrug()}
        />
        <button onClick={() => searchDrug()}>검색</button>
      </div>

      {loading && <p className="drug-empty">처리 중...</p>}

      {/* 카드 */}
      <div className="drug-grid">
        {currentItems.map((drug) => (
          <div
            key={drug.itemSeq}
            className="drug-card"
            onClick={() =>
              navigate(`/drug-detail/${drug.itemSeq}`)
            }
          >
            <h2>{drug.itemName}</h2>
            <p className="drug-company">{drug.entpName}</p>
            <p className="drug-effect">
              🧪 {drug.materialName || "성분 정보 없음"}
            </p>
          </div>
        ))}
      </div>

      {/* 결과 없음 */}
      {!loading && !currentItems.length && (
        <p className="drug-empty">검색 결과 없음</p>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="drug-pagination">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
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
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>

        </div>
      )}
    </div>
  );
}
