package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import model.DurItemDto;
import model.DurTabooWarningDto;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class DurService {

    private static final String SERVICE_KEY =
            "***REMOVED***";

    private static final String BASE_URL = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03";
    private static final String ITEM_SEARCH_PATH = "/getDurPrdlstInfoList03";
    private static final String TABOO_PATH = "/getUsjntTabooInfoList03";

    private final XmlMapper xmlMapper = new XmlMapper();

    /* =========================================
       ✅ DUR 검색
       ========================================= */
    public List<DurItemDto> searchItems(String keyword, int limit) {
        if (keyword == null || keyword.isBlank()) return List.of();

        int rows = Math.min(Math.max(limit, 1), 50);

        try {
            String encoded = URLEncoder.encode(keyword, StandardCharsets.UTF_8);

            String url = BASE_URL + ITEM_SEARCH_PATH
                    + "?serviceKey=" + SERVICE_KEY
                    + "&pageNo=1"
                    + "&numOfRows=" + rows
                    + "&type=xml"
                    + "&itemName=" + encoded;

            String xml = httpGet(url);
            JsonNode root = xmlMapper.readTree(xml.getBytes(StandardCharsets.UTF_8));

            String resultCode = root.path("header").path("resultCode").asText("");
            if (!"00".equals(resultCode)) return List.of();

            JsonNode itemNode = root.path("body").path("items").path("item");
            if (itemNode.isMissingNode() || itemNode.isNull()) {
                itemNode = root.path("body").path("items");
            }

            List<DurItemDto> out = new ArrayList<>();
            Set<String> seen = new HashSet<>();

            if (itemNode.isArray()) {
                for (JsonNode it : itemNode) {
                    addItem(out, seen, it);
                }
            } else if (itemNode.isObject()) {
                addItem(out, seen, itemNode);
            }

            return out;

        } catch (Exception e) {
            System.err.println("❌ DUR 검색 오류: " + e.getMessage());
            return List.of();
        }
    }

    /* =========================================
       ✅ 전체 품목 (최대 50개)
       ========================================= */
    public List<DurItemDto> fetchAllItems() {

        List<DurItemDto> all = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        int pageNo = 1;
        int rows = 100;
        int maxItems = 50;

        try {
            while (pageNo <= 50 && all.size() < maxItems) {

                String url = BASE_URL + ITEM_SEARCH_PATH
                        + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=" + pageNo
                        + "&numOfRows=" + rows
                        + "&type=xml";

                String xml = httpGet(url);
                JsonNode root = xmlMapper.readTree(xml.getBytes(StandardCharsets.UTF_8));

                String resultCode = root.path("header").path("resultCode").asText("");
                if (!"00".equals(resultCode)) break;

                JsonNode itemNode = root.path("body").path("items").path("item");
                if (itemNode.isMissingNode() || itemNode.isNull()) break;

                if (itemNode.isArray()) {
                    for (JsonNode it : itemNode) {
                        addItem(all, seen, it);
                        if (all.size() >= maxItems) break;
                    }
                } else if (itemNode.isObject()) {
                    addItem(all, seen, itemNode);
                }

                pageNo++;
            }

        } catch (Exception e) {
            System.err.println("❌ DUR 전체 조회 오류: " + e.getMessage());
        }

        return all;
    }

    /* =========================================
       ⭐ DTO 확장 대응 addItem()
       ========================================= */
    private void addItem(List<DurItemDto> out, Set<String> seen, JsonNode it) {

        String itemSeq = it.path("ITEM_SEQ").asText("").trim();
        String itemName = it.path("ITEM_NAME").asText("").trim();
        String entpName = it.path("ENTP_NAME").asText("").trim();

        if (itemSeq.isBlank() || itemName.isBlank()) return;
        if (!seen.add(itemSeq)) return;

        // ⭐⭐⭐⭐⭐ 확장 필드 파싱
        String materialName = it.path("MATERIAL_NAME").asText("");
        String chart = it.path("CHART").asText("");
        String storageMethod = it.path("STORAGE_METHOD").asText("");
        String validTerm = it.path("VALID_TERM").asText("");

        out.add(new DurItemDto(
                itemSeq,
                itemName,
                entpName,
                materialName,
                chart,
                storageMethod,
                validTerm
        ));
    }

    /* =========================================
       ✅ 병용금기
       ========================================= */
    public List<DurTabooWarningDto> checkTaboo(List<String> itemSeqs) {

        if (itemSeqs == null) return List.of();

        Set<String> selected = new LinkedHashSet<>();
        for (String s : itemSeqs) {
            if (s != null && !s.isBlank()) selected.add(s.trim());
        }
        if (selected.size() < 2) return List.of();

        List<DurTabooWarningDto> result = new ArrayList<>();
        Set<String> pairDedup = new HashSet<>();

        for (String baseSeq : selected) {
            try {
                String url = BASE_URL + TABOO_PATH
                        + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=1"
                        + "&numOfRows=200"
                        + "&type=xml"
                        + "&typeName=" + URLEncoder.encode("병용금기", StandardCharsets.UTF_8)
                        + "&itemSeq=" + URLEncoder.encode(baseSeq, StandardCharsets.UTF_8);

                String xml = httpGet(url);
                JsonNode root = xmlMapper.readTree(xml.getBytes(StandardCharsets.UTF_8));

                String resultCode = root.path("header").path("resultCode").asText("");
                if (!"00".equals(resultCode)) continue;

                JsonNode itemNode = root.path("body").path("items").path("item");
                if (itemNode.isMissingNode() || itemNode.isNull()) continue;

                if (itemNode.isArray()) {
                    for (JsonNode it : itemNode) {
                        maybeAddTaboo(result, pairDedup, selected, it);
                    }
                } else if (itemNode.isObject()) {
                    maybeAddTaboo(result, pairDedup, selected, itemNode);
                }

            } catch (Exception e) {
                System.err.println("❌ 병용금기 오류(" + baseSeq + "): " + e.getMessage());
            }
        }

        return result;
    }

    private void maybeAddTaboo(
            List<DurTabooWarningDto> result,
            Set<String> pairDedup,
            Set<String> selected,
            JsonNode it
    ) {

        String aSeq = it.path("ITEM_SEQ").asText("").trim();
        String bSeq = it.path("MIXTURE_ITEM_SEQ").asText("").trim();

        if (aSeq.isBlank() || bSeq.isBlank()) return;
        if (!selected.contains(aSeq) || !selected.contains(bSeq)) return;
        if (aSeq.equals(bSeq)) return;

        String key = canonicalPairKey(aSeq, bSeq);
        if (!pairDedup.add(key)) return;

        String aName = it.path("ITEM_NAME").asText("");
        String bName = it.path("MIXTURE_ITEM_NAME").asText("");
        String reason = it.path("PROHBT_CONTENT").asText("");

        if (reason.isBlank()) reason = "병용금기 조합";

        result.add(new DurTabooWarningDto(
                aName + " + " + bName,
                "금지",
                reason
        ));
    }

    private String canonicalPairKey(String a, String b) {
        return (a.compareTo(b) <= 0) ? (a + "|" + b) : (b + "|" + a);
    }

    /* ========================================= */
    private String httpGet(String urlStr) throws Exception {

        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(10000);

        int code = conn.getResponseCode();

        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        (code >= 200 && code < 300)
                                ? conn.getInputStream()
                                : conn.getErrorStream(),
                        StandardCharsets.UTF_8
                )
        )) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            return sb.toString();
        }
    }

    public List<DurItemDto> searchByItemSeq(String itemSeq) {

    try {
        String url = BASE_URL + ITEM_SEARCH_PATH
                + "?serviceKey=" + SERVICE_KEY
                + "&pageNo=1"
                + "&numOfRows=1"
                + "&type=xml"
                + "&itemSeq=" + URLEncoder.encode(itemSeq, StandardCharsets.UTF_8);

        System.out.println("🔍 itemSeq 조회 = " + itemSeq);

        String xml = httpGet(url);
        JsonNode root = xmlMapper.readTree(xml.getBytes(StandardCharsets.UTF_8));

        String resultCode = root.path("header").path("resultCode").asText("");
        if (!"00".equals(resultCode)) return List.of();

        JsonNode itemNode = root.path("body").path("items").path("item");

        if (itemNode.isMissingNode() || itemNode.isNull()) return List.of();

        List<DurItemDto> out = new ArrayList<>();
        Set<String> seen = new HashSet<>();

        if (itemNode.isArray()) {
            for (JsonNode it : itemNode) addItem(out, seen, it);
        } else if (itemNode.isObject()) {
            addItem(out, seen, itemNode);
        }

        return out;

    } catch (Exception e) {
        System.err.println("❌ itemSeq 조회 오류: " + e.getMessage());
        return List.of();
    }
}
}
