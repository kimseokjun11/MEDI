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

/**
 * DUR(Drug Utilization Review) API 연동 서비스
 *
 * 1) DUR 품목정보 조회 API: getDurPrdlstInfoList03
 * 2) 병용금기 정보조회 API: getUsjntTabooInfoList03
 */
@Service
public class DurService {

    // ✅ 사용자 제공 서비스키(이미 URL 인코딩된 값)
    private static final String SERVICE_KEY =
            "***REMOVED***";

    private static final String BASE_URL = "https://apis.data.go.kr/1471000/DURPrdlstInfoService03";
    private static final String ITEM_SEARCH_PATH = "/getDurPrdlstInfoList03";
    private static final String TABOO_PATH = "/getUsjntTabooInfoList03";

    private final XmlMapper xmlMapper = new XmlMapper();

    /**
     * ✅ 의약품명으로 DUR 품목 검색 (자동완성용)
     */
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

            // resultCode 체크
            String resultCode = root.path("header").path("resultCode").asText("");
            if (!"00".equals(resultCode)) {
                return List.of();
            }

            JsonNode itemNode = root.path("body").path("items").path("item");
            if (itemNode.isMissingNode() || itemNode.isNull()) {
                // 어떤 경우엔 body/items 바로 아래에 item 배열이 올 수 있음
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
            System.err.println("DUR 품목 검색 오류: " + e.getMessage());
            return List.of();
        }
    }

    private void addItem(List<DurItemDto> out, Set<String> seen, JsonNode it) {
        String itemSeq = it.path("ITEM_SEQ").asText("").trim();
        String itemName = it.path("ITEM_NAME").asText("").trim();
        String entpName = it.path("ENTP_NAME").asText("").trim();

        if (itemSeq.isBlank() || itemName.isBlank()) return;
        if (!seen.add(itemSeq)) return;

        out.add(new DurItemDto(itemSeq, itemName, entpName));
    }

    /**
     * ✅ 등록된 itemSeq 목록을 기준으로 병용금기 조합을 찾아 반환
     * - API 응답의 PROHBT_CONTENT를 description으로 사용
     */
    public List<DurTabooWarningDto> checkTaboo(List<String> itemSeqs) {
        if (itemSeqs == null) return List.of();

        // 공백 제거 + 중복 제거
        Set<String> selected = new LinkedHashSet<>();
        for (String s : itemSeqs) {
            if (s != null && !s.isBlank()) selected.add(s.trim());
        }
        if (selected.size() < 2) return List.of();

        List<DurTabooWarningDto> result = new ArrayList<>();
        Set<String> pairDedup = new HashSet<>(); // "min|max" 형태

        for (String baseSeq : selected) {
            try {
                String url = BASE_URL + TABOO_PATH
                        + "?serviceKey=" + SERVICE_KEY
                        + "&pageNo=1"
                        + "&numOfRows=200"
                        + "&type=xml"
                        // 병용금기만
                        + "&typeName=" + URLEncoder.encode("병용금기", StandardCharsets.UTF_8)
                        + "&itemSeq=" + URLEncoder.encode(baseSeq, StandardCharsets.UTF_8);

                String xml = httpGet(url);
                JsonNode root = xmlMapper.readTree(xml.getBytes(StandardCharsets.UTF_8));

                String resultCode = root.path("header").path("resultCode").asText("");
                if (!"00".equals(resultCode)) continue;

                JsonNode itemNode = root.path("body").path("items").path("item");
                if (itemNode.isMissingNode() || itemNode.isNull()) {
                    itemNode = root.path("body").path("items");
                }

                if (itemNode.isArray()) {
                    for (JsonNode it : itemNode) {
                        maybeAddTaboo(result, pairDedup, selected, it);
                    }
                } else if (itemNode.isObject()) {
                    maybeAddTaboo(result, pairDedup, selected, itemNode);
                }

            } catch (Exception e) {
                // 한 품목 실패해도 전체가 죽지 않도록
                System.err.println("DUR 병용금기 조회 오류(" + baseSeq + "): " + e.getMessage());
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

        String aName = it.path("ITEM_NAME").asText("").trim();
        String bName = it.path("MIXTURE_ITEM_NAME").asText("").trim();
        String reason = it.path("PROHBT_CONTENT").asText("").trim();
        if (reason.isBlank()) reason = "병용금기(금지) 조합입니다.";

        // UI 형태 유지
        result.add(new DurTabooWarningDto(
                (aName.isBlank() ? aSeq : aName) + " + " + (bName.isBlank() ? bSeq : bName),
                "금지",
                reason
        ));
    }

    private String canonicalPairKey(String a, String b) {
        return (a.compareTo(b) <= 0) ? (a + "|" + b) : (b + "|" + a);
    }

    private String httpGet(String urlStr) throws Exception {
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(10000);

        int code = conn.getResponseCode();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(
                (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream(),
                StandardCharsets.UTF_8
        ))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            return sb.toString();
        }
    }
}
