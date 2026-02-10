package repository;

import model.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
    // 필요한 경우 검색 기능 등 추가 가능
}
