package repository;
import model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 게시글의 댓글만 가져오기
    List<Comment> findByBoardId(Long boardId);
}
