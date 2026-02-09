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
     * 전체 공공데이터 조회 (샘플 데이터)
     */
    @GetMapping
    public ResponseEntity<List<PublicData>> getAllPublicData() {
        List<PublicData> list = publicDataService.getSampleData();
        return ResponseEntity.ok(list);
    }
}
