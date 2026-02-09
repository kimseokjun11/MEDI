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

/**
 * 공공데이터 Service - 외부 API 호출 및 파싱
 */
@Service
public class PublicDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 공공데이터 API 서비스키 (본인 키로 변경 필요)
    private static final String SERVICE_KEY = "YOUR_SERVICE_KEY_HERE";

    /**
     * 공공데이터 API 호출 예시
     * 실제 사용 시 공공데이터포털에서 발급받은 API 주소와 키를 사용
     */
    public List<PublicData> fetchFromApi(String apiUrl) {
        List<PublicData> list = new ArrayList<>();

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                response.append(line);
            }
            br.close();

            // JSON 파싱
            list = parseJson(response.toString());

        } catch (Exception e) {
            System.err.println("API 호출 실패: " + e.getMessage());
        }

        return list;
    }

    /**
     * JSON 응답을 PublicData 리스트로 파싱
     */
    private List<PublicData> parseJson(String json) {
        List<PublicData> list = new ArrayList<>();

        try {
            JsonNode rootNode = objectMapper.readTree(json);
            // 실제 API 응답 구조에 맞게 수정 필요
            JsonNode items = rootNode.path("response").path("body").path("items");

            if (items.isArray()) {
                for (JsonNode item : items) {
                    PublicData data = new PublicData();
                    data.setTitle(item.path("title").asText(""));
                    data.setDescription(item.path("description").asText(""));
                    data.setCategory(item.path("category").asText(""));
                    data.setProvider(item.path("provider").asText(""));
                    data.setUpdateDate(item.path("updateDate").asText(""));
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
