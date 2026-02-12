import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Medicine.css';
import TopToggle from "../pages/TopToggle";

interface PublicData {
  sttemntNo: string;
  title: string;
  provider: string;
  description?: string;
}

const parsePurpose = (desc?: string) => {
  if (!desc) return '-';
  const match = desc.match(/\[기능성\](.*)/);
  return match ? match[1].trim() : '-';
};

const Medicine = () => {
  const [medicineList, setMedicineList] = useState<PublicData[]>([]);
  const [keyword, setKeyword] = useState('');
  const [filteredList, setFilteredList] = useState<PublicData[]>([]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/medicines');
      const data: PublicData[] = await res.json();

      setMedicineList(data || []);
      setFilteredList(data || []);   // ✅ 초기 전체 표시
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ 검색 버튼 클릭 */
  const searchMedicine = () => {
    if (!keyword.trim()) {
      setFilteredList(medicineList);  // 검색어 없으면 전체 복구
    } else {
      const result = medicineList.filter(item =>
        item.title?.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredList(result);
    }

    setCurrentPage(1); // ✅ 검색 시 1페이지
  };

  /* ✅ 페이징 */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="medicine">

      {/* ✅ 상단 */}
      <div className="medicine-top">
        <h1>건강기능식품 정보</h1>
        <TopToggle />
      </div>

      {/* ✅ 검색창 + 버튼 */}
      <div className="medicine-search">
        <input
          type="text"
          placeholder="제품명을 검색하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchMedicine()}
        />
        <button onClick={searchMedicine}>검색</button>
      </div>

      {loading && <p className="no-data">🔍 불러오는 중...</p>}

      {!loading && currentItems.length > 0 ? (
        <div className="medicine-grid">
          {currentItems.map((item) => (
            <div
              key={item.sttemntNo}
              className="medicine-card"
              onClick={() => navigate(`/medicine/${item.sttemntNo}`)}
            >
              <h3>{item.title || '-'}</h3>
              <p className="company">{item.provider || '-'}</p>
              <p className="effect">
                {parsePurpose(item.description)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="no-data">검색 결과가 없습니다.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
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
};

export default Medicine;
