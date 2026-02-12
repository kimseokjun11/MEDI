package service;

import lombok.RequiredArgsConstructor;
import model.Qna;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import repository.QnaRepository;

@Service
@RequiredArgsConstructor
public class AdminQnaService {

    private final QnaRepository qnaRepository;

    /**
     * 관리자용 전체 목록 (비밀글 포함)
     */
    public Page<Qna> list(int page, String keyword) {

        Pageable pageable = PageRequest.of(
                page,
                10,
                Sort.by(Sort.Direction.DESC, "id")
        );

        if (keyword == null || keyword.isEmpty()) {
            return qnaRepository.findAll(pageable);
        }

        return qnaRepository
                .findByTitleContaining(keyword, pageable);
    }

    /**
     * 답변 등록
     */
    public Qna writeAnswer(Long id, String answerContent) {

        Qna qna = qnaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 글"));

        qna.setAnswer(answerContent);
        qna.setAnswered(true);

        return qnaRepository.save(qna);
    }
}
