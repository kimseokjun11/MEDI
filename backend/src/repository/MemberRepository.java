package repository;

import model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    // 🔴 findByLoginId -> findByUserid 로 변경
    // (이제 Member 안에 userid라는 변수가 있으니까 이렇게 써야 함)
    Optional<Member> findByUserid(String userid);

    Optional<Member> findByEmail(String email);
    
    // 🔴 existsByLoginId -> existsByUserid 로 변경
    boolean existsByUserid(String userid);

    //일반 사용자 수만 카운트(관리자 제외)
    long countByRole(String role);
}
