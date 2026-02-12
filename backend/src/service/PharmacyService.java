package service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import model.Pharmacy;
import model.PharmacyPageResponse;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class PharmacyService {

    /**
     * ✅ 공공데이터포털 serviceKey
     * - 이미 URL 인코딩(%2B, %2F, %3D 등)된 값이라
     * - 또 URLEncoder.encode() 하면 깨질 수 있음 → 그대로 붙이기
     */
    private static final String SERVICE_KEY =
            "***REMOVED***";

    /**
     * ✅ 약국 목록 조회 API URL
     * - 뒤에 query parameter로 Q0/Q1/QT/QN/ORD/pageNo/numOfRows가 붙음
     */
    private static final String LIST_URL =
            "https://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire";

    /**
     * ✅ XML을 Java 객체로 매핑해주는 Jackson XML 파서
     * - xmlMapper.readValue(xmlString, Class) 형태로 사용
     */
    private final XmlMapper xmlMapper = new XmlMapper();

    /**
     * ✅ 기본 호출 (pageNo=1, numOfRows=10)
     */
    public PharmacyPageResponse fetchPage(String q0, String q1, Integer qt, String qn, String ord) {
        return fetchPage(q0, q1, qt, qn, ord, 1, 10);
    }

    /**
     * ✅ 검색 + 페이징 지원
     * 1) 외부 API 호출
     * 2) 응답 XML 문자열 수집
     * 3) XML 파싱 → PharmacyPageResponse 생성 (items + totalCount + totalPages)
     */
    public PharmacyPageResponse fetchPage(String q0, String q1, Integer qt, String qn, String ord,
                                          int pageNo, int numOfRows) {

        // ✅ 안전장치 (프론트가 이상한 값 보내도 서버가 보호)
        if (pageNo < 1) pageNo = 1;
        if (numOfRows < 1) numOfRows = 10;
        if (numOfRows > 1000) numOfRows = 1000;

        try {
            // ✅ 파라미터들을 조합해서 최종 요청 URL 생성
            URL url = buildListUrl(q0, q1, qt, qn, ord, pageNo, numOfRows);

            // ✅ HTTP 연결 생성
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            // ✅ 이 API는 XML 응답이 기본 → XML로 받기
            conn.setRequestProperty("Accept", "application/xml");

            // ✅ 타임아웃 설정
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(10000);

            // ✅ HTTP 상태 코드 확인 (200이면 정상)
            int code = conn.getResponseCode();

            // ✅ 정상(2xx)이면 inputStream, 에러면 errorStream 읽기
            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream(),
                    StandardCharsets.UTF_8
            ))) {
                // ✅ 응답 XML을 문자열로 전부 합치기
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) sb.append(line);

                if (code >= 200 && code < 300) {
                    // ✅ 성공이면 XML 파싱해서 프론트용 JSON 응답 객체로 변환
                    return parseToPage(sb.toString(), pageNo, numOfRows);
                } else {
                    // ✅ 실패면 에러 로그 출력 후 빈 페이지 반환
                    System.err.println("약국 API 오류(" + code + "): " + sb);
                    return emptyPage(pageNo, numOfRows);
                }
            }

        } catch (Exception e) {
            // ✅ 예외 발생(네트워크, 파싱 등) 시 빈 페이지 반환
            System.err.println("약국 API 호출 실패: " + e.getMessage());
            return emptyPage(pageNo, numOfRows);
        }
    }

    /**
     * ✅ 빈 페이지 응답(에러/예외일 때)
     */
    private PharmacyPageResponse emptyPage(int pageNo, int numOfRows) {
        return new PharmacyPageResponse(List.of(), pageNo, numOfRows, 0, 0, false);
    }

    /**
     * ✅ 최종 요청 URL 구성
     * - serviceKey, pageNo, numOfRows 기본 포함
     * - q0/q1/qn은 한글이 들어갈 수 있으니 URL 인코딩 필요
     * - ord는 보통 영어(NAME)지만 공백/특수문자 가능성 고려해서 인코딩 처리
     */
    private URL buildListUrl(String q0, String q1, Integer qt, String qn, String ord,
                             int pageNo, int numOfRows) throws Exception {

        StringBuilder sb = new StringBuilder(LIST_URL)
                .append("?serviceKey=").append(SERVICE_KEY)
                .append("&pageNo=").append(pageNo)
                .append("&numOfRows=").append(numOfRows);

        // ✅ 선택 파라미터들(값이 있을 때만 붙임)
        if (q0 != null && !q0.isBlank()) sb.append("&Q0=").append(enc(q0));
        if (q1 != null && !q1.isBlank()) sb.append("&Q1=").append(enc(q1));
        if (qt != null) sb.append("&QT=").append(qt);
        if (qn != null && !qn.isBlank()) sb.append("&QN=").append(enc(qn));
        if (ord != null && !ord.isBlank()) sb.append("&ORD=").append(enc(ord));

        return new URL(sb.toString());
    }

    /**
     * ✅ 한글/공백을 URL query에 넣을 수 있게 UTF-8 인코딩
     */
    private String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    /**
     * ✅ XML 문자열을 파싱해서 "프론트가 원하는 페이지 응답"으로 변환
     */
    private PharmacyPageResponse parseToPage(String xml, int requestedPageNo, int requestedNumOfRows) throws Exception {
        // ✅ <response>...</response> 전체를 PharmacyApiResponse로 매핑
        PharmacyApiResponse parsed = xmlMapper.readValue(xml, PharmacyApiResponse.class);

        if (parsed == null || parsed.body == null) {
            return emptyPage(requestedPageNo, requestedNumOfRows);
        }

        // ✅ 공공 API는 HTTP 200이어도 XML 내부 resultCode가 에러일 수 있음
        if (parsed.header != null && parsed.header.resultCode != null
                && !"00".equals(parsed.header.resultCode.trim())) {
            System.err.println("API resultCode=" + parsed.header.resultCode + ", msg=" + parsed.header.resultMsg);
        }

        // ✅ 약국 목록 꺼내기
        List<Pharmacy> items = List.of();
        if (parsed.body.items != null && parsed.body.items.item != null) {
            items = parsed.body.items.item;
        }

        // ✅ 외부 API가 내려준 메타 정보
        int totalCount = parsed.body.totalCount;
        int numOfRows = parsed.body.numOfRows > 0 ? parsed.body.numOfRows : requestedNumOfRows;
        int pageNo = parsed.body.pageNo > 0 ? parsed.body.pageNo : requestedPageNo;

        // ✅ totalPages는 직접 계산(올림)
        int totalPages = (numOfRows <= 0 || totalCount <= 0)
                ? 0
                : (int) Math.ceil((double) totalCount / (double) numOfRows);

        // ✅ 다음 페이지 존재 여부
        boolean hasNext = totalPages > 0 && pageNo < totalPages;

        // ✅ 프론트에 내려줄 최종 응답
        return new PharmacyPageResponse(items, pageNo, numOfRows, totalCount, totalPages, hasNext);
    }

    // ==========================================================
    // ✅ 아래 클래스들은 "XML 구조 그대로" 매핑하기 위한 내부 DTO
    //    XML 구조:
    //    <response>
    //      <header>...</header>
    //      <body>
    //        <items>
    //          <item>...</item>
    //          <item>...</item>
    //        </items>
    //        <numOfRows>...</numOfRows>
    //        <pageNo>...</pageNo>
    //        <totalCount>...</totalCount>
    //      </body>
    //    </response>
    // ==========================================================

    @JacksonXmlRootElement(localName = "response")
    static class PharmacyApiResponse {

        @JacksonXmlProperty(localName = "header")
        public Header header;

        @JacksonXmlProperty(localName = "body")
        public Body body;
    }

    static class Header {
        @JacksonXmlProperty(localName = "resultCode")
        public String resultCode;

        @JacksonXmlProperty(localName = "resultMsg")
        public String resultMsg;
    }

    static class Body {
        @JacksonXmlProperty(localName = "items")
        public Items items;

        @JacksonXmlProperty(localName = "numOfRows")
        public int numOfRows;

        @JacksonXmlProperty(localName = "pageNo")
        public int pageNo;

        @JacksonXmlProperty(localName = "totalCount")
        public int totalCount;
    }

    static class Items {
        /**
         * ✅ useWrapping=false 의미:
         * XML이
         * <items>
         *   <item>...</item>
         *   <item>...</item>
         * </items>
         * 처럼 item이 바로 반복될 때, wrapper 없이 리스트로 받겠다는 뜻
         */
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "item")
        public List<Pharmacy> item;
    }
}
