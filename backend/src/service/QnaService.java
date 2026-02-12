package service;

import lombok.RequiredArgsConstructor;
import model.Qna;
import model.QnaComment;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import repository.QnaCommentRepository;
import repository.QnaRepository;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final QnaCommentRepository commentRepository;

    public Page<Qna> list(int page, String keyword) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("id").descending());

        if (keyword == null || keyword.isBlank()) {
            return qnaRepository.findAll(pageable);
        }

        return qnaRepository.findByTitleContaining(keyword, pageable);
    }

    public Qna detail(Long id) {
        return qnaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("글을 찾을 수 없습니다."));
    }

    public Qna write(Qna qna) {
        qna.setAnswered(false);
        qna.setDate(LocalDateTime.now());
        return qnaRepository.save(qna);
    }

    public void addComment(Long id, QnaComment comment) {
        Qna qna = qnaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("글을 찾을 수 없습니다."));

        comment.setQna(qna);
        comment.setDate(LocalDateTime.now());
        commentRepository.save(comment);
    }
}
