package service;

import model.PublicData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

// [추가] 한글/공백 검색어 인코딩을 위해 필요
import java.net.URLEncoder;                          // [추가]
import java.nio.charset.StandardCharsets;            // [추가]


/**
 * 공공데이터 Service - 외부 API 호출 및 파싱
 */
@Service
public class PublicDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 공공데이터 API 서비스키 (본인 키로 변경 필요)
    private static final String SERVICE_KEY = "***REMOVED***";

    
    // [추가] 반복되는 URL을 상수로 분리
    private static final String BASE_URL =
            "https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsItem01"; // [추가]

    /**
     * 공공데이터 API 호출 예시
     * 실제 사용 시 공공데이터포털에서 발급받은 API 주소와 키를 사용
     */
    public List<PublicData> fetchFromApi(String searchWord) {
        List<PublicData> list = new ArrayList<>();

        try {
            System.out.println(searchWord);
            URL url;

            // [수정] null 뿐 아니라 공백/빈문자도 기본조회로 처리
            if (searchWord == null || searchWord.isBlank()) { // [수정]
                url = new URL(BASE_URL + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=1&numOfRows=10&type=json"); // [수정: 상수 사용]
            } else {
                // [추가] 한글/공백 검색어는 URL 인코딩 필수
                String encoded = URLEncoder.encode(searchWord, StandardCharsets.UTF_8); // [추가]

                // [수정] searchWord 그대로 붙이지 말고 encoded 사용
                url = new URL(BASE_URL + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=1&numOfRows=10&type=json"
                        + "&Prduct=" + encoded); // [수정]
            }
                
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

          // [추가] 타임아웃 설정(멈춤 방지)
            conn.setConnectTimeout(5000); // [추가]
            conn.setReadTimeout(10000);   // [추가]

            // [추가] 400 같은 에러일 때 에러 메시지도 읽어서 출력 + fallback 판단
            int code = conn.getResponseCode(); // [추가]
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream(),
                    StandardCharsets.UTF_8
            )); // [수정: errorStream 처리]

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();
            System.out.println(response.toString());
             // [추가] Prduct 파라미터가 API에서 거절(400 등)되면 자바 필터링 방식으로 검색
            if (code >= 200 && code < 300) { // [추가]
            // JSON 파싱
            list = parseJson(response.toString());
             } else { // [추가]
                System.err.println("API 오류(" + code + "): " + response);

                // fallback: API 검색 파라미터가 안 먹히는 경우
                if (searchWord != null && !searchWord.isBlank()) { // [추가]
                    list = searchByFiltering(searchWord);          // [추가]
                } else {
                    list = List.of();
                }
            }

        } catch (Exception e) {
            System.err.println("API 호출 실패: " + e.getMessage());
        }

        return list;
    }

       // [추가] fallback 검색: 여러 페이지를 받아서 PRDUCT(title)에 포함되는 것만 반환
    private List<PublicData> searchByFiltering(String searchWord) { // [추가]
        String k = normalize(searchWord);

        int numOfRows = 100;
        int maxPages = 30; // MVP 제한
        int limit = 20;

        List<PublicData> result = new ArrayList<>();

        for (int page = 1; page <= maxPages; page++) {
            try {
                URL url = new URL(BASE_URL + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=" + page
                        + "&numOfRows=" + numOfRows
                        + "&type=json");

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(10000);

                int code = conn.getResponseCode();
                if (code < 200 || code >= 300) break;

                BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) sb.append(line);
                br.close();

                List<PublicData> pageList = parseJson(sb.toString());
                if (pageList.isEmpty()) break;

                for (PublicData d : pageList) {
                    if (normalize(d.getTitle()).contains(k)) {
                        result.add(d);
                        if (result.size() >= limit) return result;
                    }
                }

            } catch (Exception e) {
                break;
            }
        }

        return result;
    }

    // [추가] 검색 비교용 정규화(공백 제거 + 소문자)
    private String normalize(String s) { // [추가]
        if (s == null) return "";
        return s.replaceAll("\\s+", "").toLowerCase();
    }

    /**
     * JSON 응답을 PublicData 리스트로 파싱
     */
   private List<PublicData> parseJson(String json) {
    List<PublicData> list = new ArrayList<>();

    try {
        JsonNode rootNode = objectMapper.readTree(json);

        // Htfs 응답 구조: header/body/items
        JsonNode items = rootNode.path("body").path("items");

        if (items.isArray()) {
            for (JsonNode wrapper : items) {

                // 실제 데이터는 wrapper 안의 "item"
                JsonNode it = wrapper.path("item");

                PublicData data = new PublicData();

                // ✅ 고유키 저장
                data.setSttemntNo(it.path("STTEMNT_NO").asText("").trim());

                // 제품명
                data.setTitle(it.path("PRDUCT").asText("").trim());

                // 업체명
                data.setProvider(it.path("ENTRPS").asText("").trim());

                // 등록일 (YYYYMMDD)
                data.setUpdateDate(it.path("REGIST_DT").asText("").trim());

                // 기능성(카테고리처럼 사용)
                data.setCategory(it.path("MAIN_FNCTN").asText("").trim());

                // 상세 설명(원하는 필드만 합치기)
                String desc = ""
                        + "[신고번호] " + it.path("STTEMNT_NO").asText("") + "\n"
                        + "[유통기한] " + it.path("DISTB_PD").asText("") + "\n"
                        + "[섭취방법] " + it.path("SRV_USE").asText("") + "\n"
                        + "[보관방법] " + it.path("PRSRV_PD").asText("") + "\n"
                        + "[주의사항] " + it.path("INTAKE_HINT1").asText("") + "\n"
                        + "[기능성] " + it.path("MAIN_FNCTN").asText("") + "\n"
                        + "[기준규격] " + it.path("BASE_STANDARD").asText("");
                data.setDescription(desc.trim());

                list.add(data);
            }
        }
    } catch (Exception e) {
        System.err.println("JSON 파싱 실패: " + e.getMessage());
    }

    return list;
}


    /**
     * 샘플 데이터 반환 (API 없이 테스트용)
     */
    public List<PublicData> getSampleData() {
        List<PublicData> list = new ArrayList<>();

        PublicData d1 = new PublicData();
        d1.setId(1);
        d1.setTitle("서울시 공공자전거 대여소 정보");
        d1.setDescription("서울시 따릉이 대여소 위치 및 현황");
        d1.setCategory("교통");
        d1.setProvider("서울특별시");
        d1.setUpdateDate("2026-01-30");
        list.add(d1);

        PublicData d2 = new PublicData();
        d2.setId(2);
        d2.setTitle("전국 관광지 정보");
        d2.setDescription("전국 주요 관광지 상세 정보");
        d2.setCategory("관광");
        d2.setProvider("한국관광공사");
        d2.setUpdateDate("2026-01-29");
        list.add(d2);

        PublicData d3 = new PublicData();
        d3.setId(3);
        d3.setTitle("실시간 대기질 정보");
        d3.setDescription("전국 대기오염 측정 데이터");
        d3.setCategory("환경");
        d3.setProvider("환경부");
        d3.setUpdateDate("2026-01-31");
        list.add(d3);

        PublicData d4 = new PublicData();
        d4.setId(4);
        d4.setTitle("전국 도서관 정보");
        d4.setDescription("전국 공공도서관 위치 및 정보");
        d4.setCategory("문화");
        d4.setProvider("문화체육관광부");
        d4.setUpdateDate("2026-01-28");
        list.add(d4);

        PublicData d5 = new PublicData();
        d5.setId(5);
        d5.setTitle("버스 노선 정보");
        d5.setDescription("전국 버스 노선 및 정류장 정보");
        d5.setCategory("교통");
        d5.setProvider("국토교통부");
        d5.setUpdateDate("2026-01-27");
        list.add(d5);

        return list;
    }
}
