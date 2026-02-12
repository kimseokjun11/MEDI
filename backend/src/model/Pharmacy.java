package model;

/**
 * ✅ 약국 정보 모델
 * - 공공데이터(응급의료기관/약국) API의 XML 응답에서 <item> 하나를 매핑하는 클래스
 * - Spring(백엔드)이 이 객체들을 JSON으로 변환해서 프론트(React)로 내려줄 때 그대로 사용
 *
 * 주의)
 * - 시간(dutyTimeXs, dutyTimeXc)은 "HHmm" 형태 문자열로 옴 (예: "0900", "1830")
 *   프론트에서 출력할 때 "09:00", "18:30" 형태로 포맷팅해서 보여주면 좋음
 */
public class Pharmacy {

    // =========================
    // ✅ 기본 정보
    // =========================

    /** 약국 주소 (예: 서울특별시 강남구 ...) */
    private String dutyAddr;

    /**
     * 기타 안내/비고
     * 예: "휴게시간 13:00~14:00" 같은 추가 정보가 여기에 들어올 수 있음
     */
    private String dutyEtc;

    /**
     * 추가 안내 정보(필드가 내려오는 경우가 있음)
     * API마다 제공 여부가 다를 수 있음 → null/빈문자 가능
     */
    private String dutyInf;

    /**
     * 지도/길찾기 참고 정보(예: "모래내시장국민은행옆" 같은 위치 설명)
     * API 응답에 있을 때만 내려옴
     */
    private String dutyMapimg;

    /** 약국 이름 (검색의 핵심 대상: QN 파라미터로 검색) */
    private String dutyName;

    /** 대표 전화번호 */
    private String dutyTel1;

    /** 팩스번호 (없는 약국도 많음) */
    private String dutyFax;

    // =========================
    // ✅ 영업 시간
    // =========================
    /**
     * dutyTime{요일}s : 시작시간(start)
     * dutyTime{요일}c : 종료시간(close)
     *
     * 값의 형태: "HHmm" (예: 0900, 1830)
     * 값이 없을 수도 있음(=해당 요일 영업정보 미제공/휴무 등)
     *
     * 요일 인덱스(공공 API에서 흔히 쓰는 규칙)
     * 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토, 7: 일, 8: 공휴일
     */
    private String dutyTime1s; private String dutyTime1c; // 월요일 시작/종료
    private String dutyTime2s; private String dutyTime2c; // 화요일 시작/종료
    private String dutyTime3s; private String dutyTime3c; // 수요일 시작/종료
    private String dutyTime4s; private String dutyTime4c; // 목요일 시작/종료
    private String dutyTime5s; private String dutyTime5c; // 금요일 시작/종료
    private String dutyTime6s; private String dutyTime6c; // 토요일 시작/종료
    private String dutyTime7s; private String dutyTime7c; // 일요일 시작/종료
    private String dutyTime8s; private String dutyTime8c; // 공휴일 시작/종료

    // =========================
    // ✅ 식별/정렬/위치
    // =========================

    /**
     * 약국 고유 ID (기관 ID)
     * - 상세조회(다른 API)나 “고유키로 React에서 key” 줄 때 유용
     */
    private String hpid;

    /**
     * 우편번호(앞 3자리 / 뒤 3자리처럼 분리되어 오는 경우가 있음)
     * 예: postCdn1=063, postCdn2=25
     * → 프론트에서 합쳐서 "06325" 형태로 표시 가능
     */
    private String postCdn1;
    private String postCdn2;

    /**
     * 응답 목록에서의 순번(랭크/번호)
     * pageNo/numOfRows 기준으로 출력 순서를 표시할 때 사용 가능
     */
    private String rnum;

    /**
     * 위도/경도(WGS84)
     * - 지도(카카오/네이버/구글) 마커 찍을 때 사용
     * - 문자열로 오므로 프론트에서 Number(...)로 변환해서 쓰는 게 보통
     */
    private String wgs84Lat;
    private String wgs84Lon;

    // =========================
    // ✅ 기본 생성자
    // =========================
    public Pharmacy() {}

    // =========================
    // ✅ Getter/Setter
    // =========================

    public String getDutyAddr() { return dutyAddr; }
    public void setDutyAddr(String dutyAddr) { this.dutyAddr = dutyAddr; }

    public String getDutyEtc() { return dutyEtc; }
    public void setDutyEtc(String dutyEtc) { this.dutyEtc = dutyEtc; }

    public String getDutyInf() { return dutyInf; }
    public void setDutyInf(String dutyInf) { this.dutyInf = dutyInf; }

    public String getDutyMapimg() { return dutyMapimg; }
    public void setDutyMapimg(String dutyMapimg) { this.dutyMapimg = dutyMapimg; }

    public String getDutyName() { return dutyName; }
    public void setDutyName(String dutyName) { this.dutyName = dutyName; }

    public String getDutyTel1() { return dutyTel1; }
    public void setDutyTel1(String dutyTel1) { this.dutyTel1 = dutyTel1; }

    public String getDutyFax() { return dutyFax; }
    public void setDutyFax(String dutyFax) { this.dutyFax = dutyFax; }

    public String getDutyTime1s() { return dutyTime1s; }
    public void setDutyTime1s(String dutyTime1s) { this.dutyTime1s = dutyTime1s; }
    public String getDutyTime1c() { return dutyTime1c; }
    public void setDutyTime1c(String dutyTime1c) { this.dutyTime1c = dutyTime1c; }

    public String getDutyTime2s() { return dutyTime2s; }
    public void setDutyTime2s(String dutyTime2s) { this.dutyTime2s = dutyTime2s; }
    public String getDutyTime2c() { return dutyTime2c; }
    public void setDutyTime2c(String dutyTime2c) { this.dutyTime2c = dutyTime2c; }

    public String getDutyTime3s() { return dutyTime3s; }
    public void setDutyTime3s(String dutyTime3s) { this.dutyTime3s = dutyTime3s; }
    public String getDutyTime3c() { return dutyTime3c; }
    public void setDutyTime3c(String dutyTime3c) { this.dutyTime3c = dutyTime3c; }

    public String getDutyTime4s() { return dutyTime4s; }
    public void setDutyTime4s(String dutyTime4s) { this.dutyTime4s = dutyTime4s; }
    public String getDutyTime4c() { return dutyTime4c; }
    public void setDutyTime4c(String dutyTime4c) { this.dutyTime4c = dutyTime4c; }

    public String getDutyTime5s() { return dutyTime5s; }
    public void setDutyTime5s(String dutyTime5s) { this.dutyTime5s = dutyTime5s; }
    public String getDutyTime5c() { return dutyTime5c; }
    public void setDutyTime5c(String dutyTime5c) { this.dutyTime5c = dutyTime5c; }

    public String getDutyTime6s() { return dutyTime6s; }
    public void setDutyTime6s(String dutyTime6s) { this.dutyTime6s = dutyTime6s; }
    public String getDutyTime6c() { return dutyTime6c; }
    public void setDutyTime6c(String dutyTime6c) { this.dutyTime6c = dutyTime6c; }

    public String getDutyTime7s() { return dutyTime7s; }
    public void setDutyTime7s(String dutyTime7s) { this.dutyTime7s = dutyTime7s; }
    public String getDutyTime7c() { return dutyTime7c; }
    public void setDutyTime7c(String dutyTime7c) { this.dutyTime7c = dutyTime7c; }

    public String getDutyTime8s() { return dutyTime8s; }
    public void setDutyTime8s(String dutyTime8s) { this.dutyTime8s = dutyTime8s; }
    public String getDutyTime8c() { return dutyTime8c; }
    public void setDutyTime8c(String dutyTime8c) { this.dutyTime8c = dutyTime8c; }

    public String getHpid() { return hpid; }
    public void setHpid(String hpid) { this.hpid = hpid; }

    public String getPostCdn1() { return postCdn1; }
    public void setPostCdn1(String postCdn1) { this.postCdn1 = postCdn1; }

    public String getPostCdn2() { return postCdn2; }
    public void setPostCdn2(String postCdn2) { this.postCdn2 = postCdn2; }

    public String getRnum() { return rnum; }
    public void setRnum(String rnum) { this.rnum = rnum; }

    public String getWgs84Lat() { return wgs84Lat; }
    public void setWgs84Lat(String wgs84Lat) { this.wgs84Lat = wgs84Lat; }

    public String getWgs84Lon() { return wgs84Lon; }
    public void setWgs84Lon(String wgs84Lon) { this.wgs84Lon = wgs84Lon; }
}
