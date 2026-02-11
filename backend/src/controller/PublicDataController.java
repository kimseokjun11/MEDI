package controller;

import model.PublicData;
import service.PublicDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 공공데이터 Controller - REST API
 */
@RestController
@RequestMapping("/api/public-data")
@CrossOrigin(origins = "*")
public class PublicDataController {

    @Autowired
    private PublicDataService publicDataService;

    /**
     * 공공데이터 조회 (검색 + 페이징)
     * 예)
     *  - /api/public-data?pageNo=1&numOfRows=100
     *  - /api/public-data?searchWord=홍삼&pageNo=2&numOfRows=100
     */
    @GetMapping
    public ResponseEntity<List<PublicData>> getAllPublicData(
            @RequestParam(required = false) String searchWord,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "100") int numOfRows
    ) {
        List<PublicData> list = publicDataService.fetchFromApi(searchWord, pageNo, numOfRows);
        return ResponseEntity.ok(list);
    }
}
