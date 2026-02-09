package service;

import model.Board;
import repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;      // ✨ 추가됨
import org.springframework.data.domain.Pageable;  // ✨ 추가됨
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    // 1. (기존) 전체 조회 - 그냥 다 가져오기
    public List<Board> getAll() {
        return boardRepository.findAll();
    }

    // 2. (✨추가) 페이징 조회 - 페이지 번호에 맞춰서 가져오기
    // Controller에서 이 친구를 찾고 있었는데 없어서 에러가 났던 겁니다!
    public Page<Board> getAll(Pageable pageable) {
        return boardRepository.findAll(pageable);
    }

    // 3. 단건 조회
    public Board getById(Long id) {
        return boardRepository.findById(id).orElse(null);
    }

    // 4. 생성
    public Board create(Board board) {
        return boardRepository.save(board);
    }

    // 5. 수정
    public void update(Long id, Board newBoard) {
        Board existing = boardRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTitle(newBoard.getTitle());
            existing.setContent(newBoard.getContent());
            // 필요한 경우 작성자 등 다른 필드도 업데이트
            boardRepository.save(existing);
        }
    }

    // 6. 삭제
    public void delete(Long id) {
        boardRepository.deleteById(id);
    }
}
