package repository;

import model.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardRepository extends JpaRepository<Board, Long> {
    //관리자 페이지
    // 관리자 작성 글 수
    @Query("""
        SELECT COUNT(b)
        FROM Board b
        JOIN Member m ON b.writer = m.userid
        WHERE m.role = :role
    """)
    long countBoardsByWriterRole(@Param("role") String role);


    //유저 페이지
    //검색을 위한 페이징 처리
    Page<Board> findByTitleContaining(String keyword, Pageable pageable);

}
