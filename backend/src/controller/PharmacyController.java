package controller;

import model.PharmacyPageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.PharmacyService;

/**
 * ✅ 프론트(React)가 호출하는 엔드포인트
 * GET /api/pharmacies?q0=...&q1=...&pageNo=...&numOfRows=...
 */
@RestController
@RequestMapping("/api/pharmacies")
@CrossOrigin(origins = "*") // 개발 단계에서는 전체 허용, 운영에서는 도메인으로 제한 추천
public class PharmacyController {

    private final PharmacyService pharmacyService;

    // 생성자 주입 (Spring이 PharmacyService 빈을 주입해줌)
    public PharmacyController(PharmacyService pharmacyService) {
        this.pharmacyService = pharmacyService;
    }

    /**
     * ✅ 약국 검색 + 페이징
     * - q0: 시도 (예: 서울특별시)
     * - q1: 시군구 (예: 강남구)
     * - qt: 요일/공휴일(1~8)
     * - qn: 약국명 검색어 (예: 삼성약국)
     * - ord: 정렬 기준 (예: NAME)
     * - pageNo: 페이지 번호 (1부터)
     * - numOfRows: 한 페이지당 개수
     */
    @GetMapping
    public ResponseEntity<PharmacyPageResponse> search(
            @RequestParam(required = false) String q0,
            @RequestParam(required = false) String q1,
            @RequestParam(required = false) Integer qt,
            @RequestParam(required = false) String qn,
            @RequestParam(required = false, defaultValue = "NAME") String ord,
            @RequestParam(required = false, defaultValue = "1") int pageNo,
            @RequestParam(required = false, defaultValue = "10") int numOfRows
    ) {
        // ✅ Service가 외부 공공 API를 호출하고 XML을 파싱한 뒤,
        //    프론트 친화적인 PharmacyPageResponse(JSON)로 만들어 반환
        PharmacyPageResponse result =
                pharmacyService.fetchPage(q0, q1, qt, qn, ord, pageNo, numOfRows);

        return ResponseEntity.ok(result);
    }
}
