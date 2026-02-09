package controller;

import model.Board;
import service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 게시판 Controller - REST API
 */
@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = "*")
public class BoardController {

    @Autowired
    private BoardService boardService;

    /**
     * 전체 게시글 조회 (페이징 적용됨)
     * 사용법: /api/boards?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<Board>> getAllBoards(@PageableDefault(size = 10) Pageable pageable) {
        // 기존의 List<Board> 반환하던 메서드는 지우고, 이 페이징 메서드만 남겨야 합니다!
        return ResponseEntity.ok(boardService.getAll(pageable));
    }

    /**
     * 게시글 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoardById(@PathVariable Long id) {
        Board board = boardService.getById(id);
        if (board != null) {
            return ResponseEntity.ok(board);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 게시글 생성
     */
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board) {
        Board saved = boardService.create(board);
        return ResponseEntity.status(201).body(saved);
    }

    /**
     * 게시글 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBoard(@PathVariable Long id, @RequestBody Board board) {
        boardService.update(id, board);
        return ResponseEntity.ok("{\"message\": \"Updated\"}");
    }

    /**
     * 게시글 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id) {
        boardService.delete(id);
        return ResponseEntity.ok("{\"message\": \"Deleted\"}");
    }
}
