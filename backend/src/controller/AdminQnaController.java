package controller;

import lombok.RequiredArgsConstructor;
import model.Qna;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import service.AdminQnaService;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/qna")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminQnaController {

    private final AdminQnaService adminQnaService;

    // 관리자용 전체 목록 조회 (비밀글 포함 모든 권한)
    @GetMapping
    public Page<Qna> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "") String keyword
    ) {
        return adminQnaService.list(page, keyword);
    }

    // ✅ 관리자 답변 등록/수정 전용 엔드포인트
    @PostMapping("/{id}/answer")
    public Qna writeAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload
    ) {
        // 프론트엔드에서 보낸 { "answer": "내용" } 구조를 받아 처리합니다.
        return adminQnaService.writeAnswer(id, payload.get("answer"));
    }
}