package service;

import lombok.RequiredArgsConstructor;
import model.Qna;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import repository.QnaRepository;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QnaService {
    private final QnaRepository qnaRepository;

    public Page<Qna> list(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("id").descending());
        return (keyword == null || keyword.isBlank()) 
            ? qnaRepository.findAll(pageable) 
            : qnaRepository.findByTitleContaining(keyword, pageable);
    }

    public Qna detail(Long id) {
        return qnaRepository.findById(id).orElseThrow(() -> new RuntimeException("글 없음"));
    }

    public Qna write(Qna qna) {
        qna.setAnswered(false);
        qna.setDate(LocalDateTime.now());
        return qnaRepository.save(qna);
    }
}