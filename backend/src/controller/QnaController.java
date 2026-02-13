package controller;

import lombok.RequiredArgsConstructor;
import model.Qna;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import service.QnaService;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QnaController {
    private final QnaService qnaService;

    @GetMapping
    public Page<Qna> list(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "") String keyword) {
        return qnaService.list(page, keyword);
    }

    @GetMapping("/{id}")
    public Qna detail(@PathVariable Long id) {
        return qnaService.detail(id);
    }

    @PostMapping
    public Qna write(@RequestBody Qna qna) {
        return qnaService.write(qna);
    }
}