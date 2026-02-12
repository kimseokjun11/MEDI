import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DrugDetail.css";

interface Drug {
  itemName: string;
  entpName: string;
  efcyQesitm: string;
  useMethodQesitm: string;
  atpnQesitm: string;
  intrcQesitm: string;
  seQesitm: string;
  depositMethodQesitm: string;
  itemImage: string;
}

export default function DrugDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [drug, setDrug] = useState<Drug | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(
        `http://localhost:8080/api/drug?itemName=${encodeURIComponent(name!)}`
      );
      const data = await res.json();
      setDrug(data[0]);
    };

    if (name) fetchDetail();
  }, [name]);

  if (!drug) return <p style={{ padding: "50px" }}>불러오는 중...</p>;

  return (
    <div className="drug-detail">
      <div className="detail-card">

        <h1 className="detail-title">{drug.itemName}</h1>
        <p className="detail-company">{drug.entpName}</p>

        {drug.itemImage && (
          <img
            src={drug.itemImage}
            alt={drug.itemName}
            className="detail-image"
          />
        )}

        <div className="detail-section">
          <h3>💊 효능</h3>
          <p>{drug.efcyQesitm}</p>
        </div>

        <div className="detail-section">
          <h3>📖 사용법</h3>
          <p>{drug.useMethodQesitm}</p>
        </div>

        <div className="detail-section">
          <h3>⚠️ 주의사항</h3>
          <p>{drug.atpnQesitm}</p>
        </div>

        <div className="detail-section">
          <h3>🔁 상호작용</h3>
          <p>{drug.intrcQesitm || "정보 없음"}</p>
        </div>

        <div className="detail-section">
          <h3>❗ 부작용</h3>
          <p>{drug.seQesitm || "정보 없음"}</p>
        </div>

        <div className="detail-section">
          <h3>📦 보관법</h3>
          <p>{drug.depositMethodQesitm}</p>
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