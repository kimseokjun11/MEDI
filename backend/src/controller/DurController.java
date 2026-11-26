package controller;

import model.DurItemDto;
import model.DurTabooCheckRequest;
import model.DurTabooWarningDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.DurApiException;
import service.DurService;

import java.util.List;
import java.util.Map;

/**
 * DUR API 중
 * - 품목 검색(자동완성)
 * - 병용금기 체크
 * - 전체 품목 조회
 */
@RestController
@RequestMapping("/api/dur")
@CrossOrigin(origins = "*")
public class DurController {

    private final DurService durService;

    public DurController(DurService durService) {
        this.durService = durService;
    }

    /**
     * ✅ 자동완성 + itemSeq 검색 통합
     * 예)
     * GET /api/dur/search?q=타이레놀
     * GET /api/dur/search?itemSeq=12345
     */
    @GetMapping("/search")
    public List<DurItemDto> search(

            @RequestParam(name = "q", required = false) String q,
            @RequestParam(name = "itemName", required = false) String itemName,

            // ⭐ itemSeq 추가
            @RequestParam(name = "itemSeq", required = false) String itemSeq,

            @RequestParam(name = "limit", required = false, defaultValue = "20") int limit
    ) {

        // ✅ itemSeq 우선 처리
        if (itemSeq != null && !itemSeq.isBlank()) {
            return durService.searchByItemSeq(itemSeq);
        }

        // ✅ 일반 검색
        String keyword = (q != null && !q.isBlank()) ? q : itemName;

        if (keyword == null || keyword.isBlank()) {
            return List.of(); // 빈 검색 방지
        }

        return durService.searchItems(keyword, limit);
    }

    /**
     * ✅ 병용금기 체크
     * 예) POST /api/dur/taboo/check
     */
    @PostMapping("/taboo/check")
    public List<DurTabooWarningDto> checkTaboo(@RequestBody DurTabooCheckRequest req) {
        if (req == null || req.itemSeqs() == null) return List.of();
        return durService.checkTaboo(req.itemSeqs());
    }

    /**
     * ✅ 전체 품목 조회
     * 예) GET /api/dur/all
     */
    @GetMapping("/all")
    public List<DurItemDto> getAllItems() {
        return durService.fetchAllItems();
    }

    /**
     * 공공데이터 API 호출에 실패하면 빈 목록 대신 502 를 돌려준다.
     * (빈 목록을 주면 화면이 "병용금기 없음" 으로 잘못 안내하게 된다)
     */
    @ExceptionHandler(DurApiException.class)
    public ResponseEntity<Map<String, String>> handleDurApiFailure(DurApiException e) {
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("message", "병용금기 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요."));
    }
}