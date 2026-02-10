package controller;

import model.Board;
import repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards") // ⚠️ 프론트엔드 규칙: 복수형 'boards'
@CrossOrigin(origins = "*")    // 리액트 접속 허용
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    // 목록 조회
    @GetMapping
    public List<Board> getAllBoards() {
        // 최신순 정렬은 프론트에서 reverse() 하거나 여기서 정렬해서 보내도 됨
        return boardRepository.findAll();
    }

    // 상세 조회
    @GetMapping("/{id}")
    public Board getBoard(@PathVariable Long id) {
        Board board = boardRepository.findById(id).orElse(null);
        if (board != null) {
            board.setViewCount(board.getViewCount() + 1); // 조회수 증가
            boardRepository.save(board);
        }
        return board;
    }

    // 글쓰기
    @PostMapping
    public Board createBoard(@RequestBody Board board) {
        return boardRepository.save(board);
    }

    // 수정
    @PutMapping("/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody Board requestBoard) {
        Board board = boardRepository.findById(id).orElse(null);
        if (board != null) {
            board.setTitle(requestBoard.getTitle());
            board.setContent(requestBoard.getContent());
            return boardRepository.save(board);
        }
        return null;
    }

    // 삭제
    @DeleteMapping("/{id}")
    public String deleteBoard(@PathVariable Long id) {
        boardRepository.deleteById(id);
        return "Deleted";
    }
}