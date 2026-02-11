package controller;

import model.Board;
import repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/boards") // ⚠️ 프론트엔드 규칙: 복수형 'boards'
@CrossOrigin(origins = "*")    // 리액트 접속 허용
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    @GetMapping
    public Page<Board> getBoards(
            @RequestParam(defaultValue = "0") int page,       // 몇 번째 페이지? (기본 0)
            @RequestParam(defaultValue = "") String keyword   // 검색어 (기본 빈칸)
    ) {
        // 1. 페이지 설정: 한 페이지에 10개씩, ID 역순(최신순)으로 정렬
        Pageable pageable = PageRequest.of(page, 10, Sort.by("id").descending());

        // 2. 검색어가 있으면 검색, 없으면 전체 조회
        if (keyword.isEmpty()) {
            return boardRepository.findAll(pageable);
        } else {
            return boardRepository.findByTitleContaining(keyword, pageable);
        }
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