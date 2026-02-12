import { useEffect, useRef, useState } from "react";
import "../styles/KakaoMap.css";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const openInfoRef = useRef<any>(null);

  const [q0, setQ0] = useState("");
  const [q1, setQ1] = useState("");
  const [qn, setQn] = useState("");

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=***REMOVED***&autoload=false";
    script.async = true;
    document.head.appendChild(script);

    script.onload = loadMap;

    function loadMap() {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;

        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        });

        mapRef.current = map;

        // ✅ 지도 클릭 시 팝업 닫기
        window.kakao.maps.event.addListener(map, "click", () => {
          if (openInfoRef.current) {
            openInfoRef.current.close();
            openInfoRef.current = null;
          }
        });

        // ✅ ESC 키 닫기
        window.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && openInfoRef.current) {
            openInfoRef.current.close();
            openInfoRef.current = null;
          }
        });

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const moveLatLon = new window.kakao.maps.LatLng(lat, lon);
            map.setCenter(moveLatLon);

            new window.kakao.maps.Marker({
              map,
              position: moveLatLon,
            });

            fetchPharmacies();
          },
          () => {
            console.warn("⚠ 위치 권한 거부됨 → 기본 위치 사용");
            fetchPharmacies();
          }
        );
      });
    }
  }, []);

  // ✅ 약국 검색
  function fetchPharmacies() {
    if (!mapRef.current) return;

    clearMarkers();

    let url = `http://localhost:8080/api/pharmacies?pageNo=1&numOfRows=50`;

    if (q0) url += `&q0=${q0}`;
    if (q1) url += `&q1=${q1}`;
    if (qn) url += `&qn=${qn}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.items || data.items.length === 0) {
          console.warn("⚠ 검색 결과 없음");
          return;
        }

        let firstValidPosition: any = null;

        data.items.forEach((pharmacy: any) => {
          const plat = Number(pharmacy.wgs84Lat);
          const plon = Number(pharmacy.wgs84Lon);

          // ❗ 좌표 방어
          if (isNaN(plat) || isNaN(plon)) {
            console.warn("⚠ 좌표 오류:", pharmacy.dutyName);
            return;
          }

          const position = new window.kakao.maps.LatLng(plat, plon);

          // ✅ 첫 유효 좌표 저장
          if (!firstValidPosition) {
            firstValidPosition = position;
          }

          const marker = new window.kakao.maps.Marker({
            map: mapRef.current,
            position,
          });

          markersRef.current.push(marker);

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div class="pharmacy-popup">
                <button class="popup-close">✕</button>

                <div class="popup-title">${pharmacy.dutyName}</div>

                <div class="popup-row">📍 ${pharmacy.dutyAddr}</div>
                <div class="popup-row">☎ ${pharmacy.dutyTel1 ?? "없음"}</div>
                <div class="popup-row">🖨 ${pharmacy.dutyFax ?? "없음"}</div>

                <div class="popup-divider"></div>

                <div class="popup-subtitle">🕒 운영 시간</div>

                <div class="popup-time">
                  ${buildOperatingHours(pharmacy)}
                </div>

                ${
                  pharmacy.dutyEtc
                    ? `<div class="popup-etc">💬 ${pharmacy.dutyEtc}</div>`
                    : ""
                }
              </div>
            `,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            mapRef.current.panTo(position);

            if (openInfoRef.current) {
              openInfoRef.current.close();
            }

            infowindow.open(mapRef.current, marker);
            openInfoRef.current = infowindow;

            setTimeout(() => {
              const closeBtn = document.querySelector(".popup-close");
              closeBtn?.addEventListener("click", () => {
                infowindow.close();
                openInfoRef.current = null;
              });
            }, 0);
          });
        });

        // ✅ 검색 후 지도 이동 (핵심)
        if (firstValidPosition) {
          mapRef.current.panTo(firstValidPosition);
        } else {
          console.warn("⚠ 유효 좌표 없음");
        }
      });
  }

  function clearMarkers() {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }

  function formatTime(time?: string) {
    if (!time || time.length !== 4) return "정보 없음";
    return `${time.slice(0, 2)}:${time.slice(2)}`;
  }

  function buildOperatingHours(pharmacy: any) {
    const days = [
      { label: "월", s: pharmacy.dutyTime1s, c: pharmacy.dutyTime1c },
      { label: "화", s: pharmacy.dutyTime2s, c: pharmacy.dutyTime2c },
      { label: "수", s: pharmacy.dutyTime3s, c: pharmacy.dutyTime3c },
      { label: "목", s: pharmacy.dutyTime4s, c: pharmacy.dutyTime4c },
      { label: "금", s: pharmacy.dutyTime5s, c: pharmacy.dutyTime5c },
      { label: "토", s: pharmacy.dutyTime6s, c: pharmacy.dutyTime6c },
      { label: "일", s: pharmacy.dutyTime7s, c: pharmacy.dutyTime7c },
      { label: "공휴일", s: pharmacy.dutyTime8s, c: pharmacy.dutyTime8c },
    ];

    return days
      .map(
        (d) => `
          <div class="popup-time-row">
            <span class="day">${d.label}</span>
            <span class="time">
              ${formatTime(d.s)} ~ ${formatTime(d.c)}
            </span>
          </div>
        `
      )
      .join("");
  }

  return (
    <div className="map-page">
      <div className="map-search">
        <input
          placeholder="시도 (예: 서울특별시)"
          value={q0}
          onChange={(e) => setQ0(e.target.value)}
        />
        <input
          placeholder="시군구 (예: 강남구)"
          value={q1}
          onChange={(e) => setQ1(e.target.value)}
        />
        <input
          placeholder="약국 이름"
          value={qn}
          onChange={(e) => setQn(e.target.value)}
        />

        <button onClick={fetchPharmacies}>검색</button>
      </div>

      <div id="map" className="map-container" />
    </div>
  );
}
