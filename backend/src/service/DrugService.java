package service;

import org.springframework.beans.factory.annotation.Value;
import model.Drug;
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

@Service
public class DrugService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 공공데이터포털 서비스키: application.properties 의 public-data.drug-service-key (깃에 올리지 않음)
    @Value("${public-data.drug-service-key:}")
    private String serviceKey;
    private static final String BASE_URL =
            "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList";

    public List<Drug> fetchDrug(String itemName) {

        List<Drug> list = new ArrayList<>();

        try {
            String encoded = URLEncoder.encode(itemName, StandardCharsets.UTF_8);

            URL url = new URL(BASE_URL
                    + "?serviceKey=" + serviceKey
                    + "&pageNo=1&numOfRows=100"
                    + "&itemName=" + encoded
                    + "&type=json");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            int responseCode = conn.getResponseCode();

            BufferedReader br = new BufferedReader(
                    new InputStreamReader(
                            (responseCode >= 200 && responseCode < 300)
                                    ? conn.getInputStream()
                                    : conn.getErrorStream(),
                            StandardCharsets.UTF_8
                    )
            );

            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                sb.append(line);
            }

            JsonNode root = objectMapper.readTree(sb.toString());
            JsonNode items = root.path("body").path("items");

            // ===== 여러 개일 때 =====
            if (items.isArray()) {
                for (JsonNode it : items) {

                    String useMethod = it.path("useMethodQesitm").asText("");

                    // 🔥 먹는 약(경구제)만 필터
                    boolean isOral =
                            useMethod.contains("복용") ||
                            useMethod.contains("경구") ||
                            useMethod.contains("식후") ||
                            useMethod.contains("식간");

                    if (!isOral) continue;

                    Drug drug = new Drug();
                    drug.setItemName(it.path("itemName").asText());
                    drug.setEntpName(it.path("entpName").asText());
                    drug.setEfcyQesitm(it.path("efcyQesitm").asText());
                    drug.setUseMethodQesitm(it.path("useMethodQesitm").asText());
                    drug.setAtpnQesitm(it.path("atpnQesitm").asText());
                    drug.setIntrcQesitm(it.path("intrcQesitm").asText());
                    drug.setSeQesitm(it.path("seQesitm").asText());
                    drug.setDepositMethodQesitm(it.path("depositMethodQesitm").asText());
                    drug.setItemImage(it.path("itemImage").asText());

                    list.add(drug);
                }
            }

            // ===== 한 개만 내려올 때 =====
            else if (items.isObject()) {

                String useMethod = items.path("useMethodQesitm").asText("");

                boolean isOral =
                        useMethod.contains("복용") ||
                        useMethod.contains("경구") ||
                        useMethod.contains("식후") ||
                        useMethod.contains("식간");

                if (isOral) {

                    Drug drug = new Drug();
                    drug.setItemName(items.path("itemName").asText());
                    drug.setEntpName(items.path("entpName").asText());
                    drug.setEfcyQesitm(items.path("efcyQesitm").asText());
                    drug.setUseMethodQesitm(items.path("useMethodQesitm").asText());
                    drug.setAtpnQesitm(items.path("atpnQesitm").asText());
                    drug.setIntrcQesitm(items.path("intrcQesitm").asText());
                    drug.setSeQesitm(items.path("seQesitm").asText());
                    drug.setDepositMethodQesitm(items.path("depositMethodQesitm").asText());
                    drug.setItemImage(items.path("itemImage").asText());

                    list.add(drug);
                }
            }

        } catch (Exception e) {
            System.err.println("Drug API 오류: " + e.getMessage());
        }

        return list;
    }
}