package controller;

import model.PublicData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.PublicDataService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // 개발/배포용 모두 허용 가능
@RequestMapping("/api/medicines")
public class MedicineController {

    private final PublicDataService publicDataService;

    public MedicineController(PublicDataService publicDataService) {
        this.publicDataService = publicDataService;
    }

    /**
     * 전체 목록 조회 또는 검색
     * keyword 없으면 전체 조회
     * @param keyword 검색어 (선택)
     * @return PublicData 리스트
     */
    @GetMapping
    public ResponseEntity<List<PublicData>> getMedicines(
            @RequestParam(required = false) String keyword
    ) {
        List<PublicData> list = publicDataService.fetchFromApi(keyword);
        if (list == null || list.isEmpty()) {
            return ResponseEntity.noContent().build(); // 데이터 없으면 204
        }
        return ResponseEntity.ok(list);
    }

    /**
     * 단일 상세 조회
     * @param id 고유 신고번호(STTEMNT_NO)
     * @return PublicData 객체 또는 404
     */
    @GetMapping("/{id}")
public ResponseEntity<PublicData> getMedicineDetail(@PathVariable String id) {
    List<PublicData> list = publicDataService.fetchFromApi("");
    return list.stream()
               .filter(m -> id.equals(m.getSttemntNo()))
               .findFirst()
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
}
}