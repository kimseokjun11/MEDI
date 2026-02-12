package controller;

import lombok.RequiredArgsConstructor;
import model.Qna;
import model.QnaComment;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import service.QnaService;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")  // ⭐ CORS 허용 (credentials 사용 안함)
public class QnaController {

    private final QnaService qnaService;

    // 목록 조회
    @GetMapping
    public Page<Qna> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "") String keyword
    ) {
        return qnaService.list(page, keyword);
    }

    // 상세 조회
    @GetMapping("/{id}")
    public Qna detail(@PathVariable Long id) {
        return qnaService.detail(id);
    }

    // 질문 작성
    @PostMapping
    public Qna write(@RequestBody Qna qna) {
        return qnaService.write(qna);
    }

    // 댓글 작성
    @PostMapping("/{id}/comments")
    public void comment(@PathVariable Long id,
                        @RequestBody QnaComment comment) {
        qnaService.addComment(id, comment);
    }
}
