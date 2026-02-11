package service;

import model.PublicData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * 공공데이터 Service - 외부 API 호출 및 파싱
 */
@Service
public class PublicDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 공공데이터 API 서비스키 (본인 키로 변경 필요)
    private static final String SERVICE_KEY =
            "***REMOVED***";

    private static final String BASE_URL =
            "https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsItem01";

    /**
     * (기존 유지) 기본 호출: pageNo=1, numOfRows=100
     */
    public List<PublicData> fetchFromApi(String searchWord) {
        return fetchFromApi(searchWord, 1, 100);
    }

    /**
     * ✅ (추가) 검색 + 페이징 지원
     */
    public List<PublicData> fetchFromApi(String searchWord, int pageNo, int numOfRows) {
        List<PublicData> list = new ArrayList<>();

        // 안전장치
        if (pageNo < 1) pageNo = 1;
        if (numOfRows < 1) numOfRows = 100;
        if (numOfRows > 1000) numOfRows = 1000; // 과도한 요청 방지(원하면 조절)

        try {
            URL url = buildUrl(searchWord, pageNo, numOfRows);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);

            int code = conn.getResponseCode();

            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream(),
                    StandardCharsets.UTF_8
            ))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }

                // (디버그) 응답 전체 출력은 너무 길어질 수 있으니 필요하면 주석 처리 추천
                // System.out.println(response);

                if (code >= 200 && code < 300) {
                    list = parseJson(response.toString());
                } else {
                    System.err.println("API 오류(" + code + "): " + response);

                    // fallback: API 검색 파라미터가 안 먹히는 경우
                    if (searchWord != null && !searchWord.isBlank()) {
                        // fallback도 pageNo/numOfRows가 의미있게 동작하도록 살짝 개선
                        list = searchByFiltering(searchWord, pageNo, numOfRows);
                    } else {
                        list = List.of();
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("API 호출 실패: " + e.getMessage());
        }

        return list;
    }

    // ✅ URL 생성(중복 제거)
    private URL buildUrl(String searchWord, int pageNo, int numOfRows) throws Exception {
        StringBuilder sb = new StringBuilder(BASE_URL)
                .append("?serviceKey=").append(SERVICE_KEY)
                .append("&pageNo=").append(pageNo)
                .append("&numOfRows=").append(numOfRows)
                .append("&type=json");

        if (searchWord != null && !searchWord.isBlank()) {
            String encoded = URLEncoder.encode(searchWord, StandardCharsets.UTF_8);
            sb.append("&Prduct=").append(encoded); // 너 코드 그대로 유지
        }

        return new URL(sb.toString());
    }

    /**
     * ✅ fallback 검색: 여러 페이지를 받아서 PRDUCT(title)에 포함되는 것만 반환
     * - pageNo/numOfRows로 자른 결과를 반환하도록 개선
     */
    private List<PublicData> searchByFiltering(String searchWord, int pageNo, int numOfRows) {
        String k = normalize(searchWord);

        int apiNumOfRows = 100;
        int maxPages = 30; // MVP 제한

        // pageNo/numOfRows 만큼은 최소한 모아야 슬라이스가 가능함
        int need = pageNo * numOfRows;
        int hardCap = Math.min(need, 1000); // fallback 과다 수집 방지(원하면 조절)

        List<PublicData> matched = new ArrayList<>();

        for (int page = 1; page <= maxPages; page++) {
            try {
                URL url = new URL(BASE_URL + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=" + page
                        + "&numOfRows=" + apiNumOfRows
                        + "&type=json");

                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");
                conn.setConnectTimeout(5000);
                conn.setReadTimeout(10000);

                int code = conn.getResponseCode();
                if (code < 200 || code >= 300) break;

                StringBuilder sb = new StringBuilder();
                try (BufferedReader br = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = br.readLine()) != null) sb.append(line);
                }

                List<PublicData> pageList = parseJson(sb.toString());
                if (pageList.isEmpty()) break;

                for (PublicData d : pageList) {
                    if (normalize(d.getTitle()).contains(k)) {
                        matched.add(d);
                        if (matched.size() >= hardCap) {
                            return slice(matched, pageNo, numOfRows);
                        }
                    }
                }

            } catch (Exception e) {
                break;
            }
        }

        return slice(matched, pageNo, numOfRows);
    }

    // ✅ pageNo/numOfRows 슬라이스
    private List<PublicData> slice(List<PublicData> src, int pageNo, int numOfRows) {
        int from = (pageNo - 1) * numOfRows;
        if (from >= src.size()) return List.of();
        int to = Math.min(from + numOfRows, src.size());
        return src.subList(from, to);
    }

    // 검색 비교용 정규화(공백 제거 + 소문자)
    private String normalize(String s) {
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
}
