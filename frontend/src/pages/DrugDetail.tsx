import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DrugDetail.css";

interface Drug {
  itemSeq: string;
  itemName: string;
  entpName: string;

  materialName: string;
  chart: string;
  storageMethod: string;
  validTerm: string;
}

export default function DrugDetail() {
  const { itemSeq } = useParams();   // ⭐ itemSeq 유지
  console.log("itemSeq =", itemSeq);
  const navigate = useNavigate();
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!itemSeq) return;

      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8080/api/dur/search?itemSeq=${itemSeq}`
        );

        if (!res.ok) throw new Error("상세 조회 실패");

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setDrug(data[0]);   // ⭐ 첫 번째 데이터
        } else {
          setDrug(null);
        }

      } catch (error) {
        console.error("❌ 상세 로딩 오류:", error);
        setDrug(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [itemSeq]);

  if (loading) {
    return <p style={{ padding: "50px" }}>불러오는 중...</p>;
  }

  if (!drug) {
    return <p style={{ padding: "50px" }}>약 정보를 찾을 수 없습니다</p>;
  }

  return (
    <div className="drug-detail">
      <div className="detail-card">

        <h1 className="detail-title">{drug.itemName}</h1>
        <p className="detail-company">{drug.entpName}</p>

        <div className="detail-section">
          <h3>🧪 성분</h3>
          <p>{drug.materialName || "정보 없음"}</p>
        </div>

        <div className="detail-section">
          <h3>💊 제형</h3>
          <p>{drug.chart || "정보 없음"}</p>
        </div>

        <div className="detail-section">
          <h3>📦 보관법</h3>
          <p>{drug.storageMethod || "정보 없음"}</p>
        </div>

        <div className="detail-section">
          <h3>⏳ 유효기간</h3>
          <p>{drug.validTerm || "정보 없음"}</p>
        </div>

        <button
          className="detail-back"
          onClick={() => navigate(-1)}
        >
          ← 뒤로가기
        </button>

      </div>
    </div>
  );
}
