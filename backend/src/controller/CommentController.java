package controller;

import model.Board;
import model.Comment;
import repository.BoardRepository;
import repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BoardRepository boardRepository;

    // 특정 게시글의 댓글 목록 가져오기
    @GetMapping("/board/{boardId}")
    public List<Comment> getCommentsByBoard(@PathVariable Long boardId) {
        return commentRepository.findByBoardId(boardId);
    }

    // 댓글 작성
    // 프론트에서 { "boardId": 1, "writer": "hong", "content": "내용" } 보냄
    @PostMapping
    public Comment addComment(@RequestBody Map<String, String> payload) {
        Long boardId = Long.parseLong(payload.get("boardId"));
        String writer = payload.get("writer");
        String content = payload.get("content");

        Board board = boardRepository.findById(boardId).orElse(null);
        if (board != null) {
            Comment comment = new Comment();
            comment.setBoard(board);
            comment.setWriter(writer);
            comment.setContent(content);
            return commentRepository.save(comment);
        }
        return null;
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public String deleteComment(@PathVariable Long id) {
        commentRepository.deleteById(id);
        return "Deleted";
    }
    
    // 댓글 수정
    @PutMapping("/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Comment comment = commentRepository.findById(id).orElse(null);
        if(comment != null) {
            comment.setContent(payload.get("content"));
            return commentRepository.save(comment);
        }
        return null;
    }
}
