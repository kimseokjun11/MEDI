import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMedicineDetail } from '../api/medicines';
import '../styles/MedicineDetail.css';

interface MedicineDetailType {
  sttemntNo: string;
  productName: string;
  companyName: string;
  manufactureNo: string;
  appearance: string;
  purpose: string;
  intakeMethod: string;
  storage: string;
  expiration: string;
  caution: string;
  imageUrl?: string; // 🔥 이미지 URL 필드 추가
}

// 🔥 id 기준 이미지 매핑
const imageMap: Record<number, string> = {
  20140017002183: '/images/20140017002183.png',
  201100200015: '/images/201100200015.png',
  20040015100230: '/images/20040015100230.png',
  2019001431755: '/images/2019001431755.png',
  2024002808071: '/images/2024002808071.jpg',
  20040020071346: '/images/20040020071346.jpg',
  20110017019173: '/images/20110017019173.png',
  20040020071298: '/images/20040020071298.png',
  200400200023786: '/images/200400200023786.png',
  2004001703094: '/images/2004001703094.png',
};

const MedicineDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState<MedicineDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getMedicineDetail(id);
        console.log('상세 API 원본 데이터:', data);

        if (!data) {
          setMedicine(null);
          return;
        }

        // 🔥 id 기반 이미지 결정
        const imageUrl = imageMap[data.id] || '/medicine-placeholder.png';

        setMedicine({
          sttemntNo: String(data.id),
          productName: data.name ?? '제품명 정보 없음',
          companyName: data.company ?? '-',
          manufactureNo: data.manufactureNo ?? '-',
          appearance: data.appearance ?? '-',
          purpose: data.purpose ?? '-',
          intakeMethod: data.intakeMethod ?? '-',
          storage: data.storage ?? '-',
          expiration: data.expiration ?? '-',
          caution: data.caution ?? '-',
          imageUrl, // 🔥 이미지 URL
        });
      } catch (e) {
        console.error('상세 조회 실패', e);
        setMedicine(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (!medicine) return <p>데이터가 없습니다.</p>;

  return (
    <div className="medicine-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 뒤로가기
      </button>

      <div className="medicine-detail-container">
        {/* 🔥 이미지 영역 */}
        <div className="medicine-image">
          <img
            src={medicine.imageUrl}
            alt={medicine.productName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/medicine-placeholder.png';
            }}
          />
        </div>

        <div className="medicine-info">
          <h1>{medicine.productName}</h1>

          <section>
            <h3>기본 정보</h3>
            <p><b>업체명</b> : {medicine.companyName}</p>
            <p><b>품목제조관리번호</b> : {medicine.manufactureNo}</p>
            <p><b>성상</b> : {medicine.appearance}</p>
          </section>

          <section>
            <h3>섭취 정보</h3>
            <p><b>용도·용법</b> : {medicine.purpose}</p>
            <p><b>섭취방법</b> : {medicine.intakeMethod}</p>
          </section>

          <section>
            <h3>보관 / 유통</h3>
            <p><b>보관방법</b> : {medicine.storage}</p>
            <p><b>유통기한</b> : {medicine.expiration}</p>
          </section>

          {medicine.caution !== '-' && (
            <section className="caution">
              ⚠️ {medicine.caution}
            </section>
          )}

        <button
  className="buy-btn"
  onClick={() => {
    // 🔥 특정 품목만 키워드 고정
    const query =
      medicine.sttemntNo === '200400200023786'
        ? '비타민A'
        : medicine.productName;
        
    window.open(
      `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(
        query
      )}`,
      '_blank'
    );
  }}
>
  🛒 비슷한 상품 네이버 스토어에서 구매하기
</button>
        </div>
      </div>
    </div>
  );
};

export default MedicineDetail;