package repository;

import model.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 게시판 Repository - Spring Data JPA
 */
@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    // 전체 목록 조회 (ID 내림차순)
    @Query("SELECT b FROM Board b ORDER BY b.id DESC")
    List<Board> findAll();

    // ID로 조회 (JpaRepository의 findById 사용 가능)
    // Optional<Board> findById(Long id); - 이미 JpaRepository에서 제공

    // 조회수 증가
    @Transactional
    @Modifying
    @Query("UPDATE Board b SET b.viewCount = b.viewCount + 1 WHERE b.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // 작성자로 검색
    @Query("SELECT b FROM Board b WHERE b.writer = :writer")
    List<Board> findByWriter(@Param("writer") String writer);

    // 제목으로 검색 (LIKE)
    @Query("SELECT b FROM Board b WHERE b.title LIKE %:keyword%")
    List<Board> findByTitleContaining(@Param("keyword") String keyword);
}
