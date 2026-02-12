package controller;

import lombok.RequiredArgsConstructor;
import model.Qna;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import service.AdminQnaService;

@RestController
@RequestMapping("/api/admin/qna")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminQnaController {

    private final AdminQnaService adminQnaService;

    /**
     * 전체 QnA 목록 (비밀글 포함)
     */
    @GetMapping
    public Page<Qna> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "") String keyword
    ) {
        return adminQnaService.list(page, keyword);
    }

    /**
     * 답변 등록
     */
    @PostMapping("/{id}/answer")
    public Qna writeAnswer(
            @PathVariable Long id,
            @RequestBody Qna qna
    ) {
        return adminQnaService.writeAnswer(id, qna.getAnswer());
    }
}
