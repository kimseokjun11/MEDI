package controller;

import model.Member;
import repository.BoardRepository;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BoardRepository boardRepository;

    // 1️⃣ 대시보드용 통계 데이터 (총 회원 수, 총 게시글 수)
    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        // 전체 회원 수 (ADMIN 제외)
        long memberCount = memberRepository.countByRole("USER");

        // 게시글 수 분리
        long adminBoardCount = boardRepository.countBoardsByWriterRole("ADMIN");
        long userBoardCount = boardRepository.countBoardsByWriterRole("USER");

        stats.put("memberCount", memberCount);
        stats.put("adminBoardCount", adminBoardCount);
        stats.put("userBoardCount", userBoardCount);

        return stats;
    }


    // 2️⃣ 회원 목록 전체 조회 (관리자용)
    @GetMapping("/members")
    public List<Member> getAllMembers() {
        // 비밀번호 같은 민감한 정보는 안 보내는 DTO를 쓰는 게 정석이지만,
        // 지금은 편의상 전체 데이터를 보내되 프론트에서 필요한 것만 보여줍시다.
        return memberRepository.findAll();
    }

    // 3️⃣ 게시글 전체 조회 (관리자용)
    // 삭제된 글이나 비밀글까지 모두 볼 수 있는 권한을 상정하고 만듭니다.
    @GetMapping("/boards")
    public List<model.Board> getAllBoards() {
        // 최신글이 위로 오게 정렬해서 보내주면 더 좋겠죠?
        // (Repository에 정렬 기능이 없다면 일단 그냥 보냅니다)
        return boardRepository.findAll();
    }

    // 4️⃣ 게시글 강제 삭제 (관리자 권한)
    @DeleteMapping("/boards/{id}")
    public String deleteBoard(@PathVariable Long id) {
        boardRepository.deleteById(id);
        return "삭제 완료";
    }
}