package controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DrugController {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String SERVICE_KEY = "***REMOVED***";

    @GetMapping("/drug-info")
    public ResponseEntity<String> getDrugInfo(@RequestParam String itemName) throws Exception {
        String encodedName = URLEncoder.encode(itemName, StandardCharsets.UTF_8);
        String url = "https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList"
                + "?serviceKey=" + SERVICE_KEY
                + "&pageNo=1&numOfRows=3"  // 필요에 따라 바꾸세요
                + "&itemName=" + encodedName
                + "&_type=json";  // JSON 형식으로 받기 위해 꼭 붙이기

        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}