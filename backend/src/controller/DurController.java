package controller;

import model.DurItemDto;
import model.DurTabooCheckRequest;
import model.DurTabooWarningDto;
import org.springframework.web.bind.annotation.*;
import service.DurService;

import java.util.List;

/**
 * DUR API 중
 * - 품목 검색(자동완성)
 * - 병용금기 체크
 * 를 프론트에서 쓰기 좋게 JSON으로 제공하는 컨트롤러
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
     * 자동완성용 검색
     * 예) GET /api/dur/search?q=타이레놀
     */
    @GetMapping("/search")
    public List<DurItemDto> search(@RequestParam(name = "q", required = false) String q,
                                   @RequestParam(name = "itemName", required = false) String itemName,
                                   @RequestParam(name = "limit", required = false, defaultValue = "20") int limit) {

        // q 또는 itemName 둘 중 하나로 받기
        String keyword = (q != null && !q.isBlank()) ? q : itemName;
        return durService.searchItems(keyword, limit);
    }

    /**
     * 병용금기 체크
     * 예) POST /api/dur/taboo/check  body: {"itemSeqs":["195700013","201405281"]}
     */
    @PostMapping("/taboo/check")
    public List<DurTabooWarningDto> checkTaboo(@RequestBody DurTabooCheckRequest req) {
        if (req == null || req.itemSeqs() == null) return List.of();
        return durService.checkTaboo(req.itemSeqs());
    }
}
