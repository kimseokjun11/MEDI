package controller;

import model.Member;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 회원 관련 요청을 처리하는 컨트롤러
 * 프론트엔드(React)의 요청 규격에 맞춰 변수명을 통일했습니다.
 */
@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") // 프론트엔드(3000번 포트)에서 오는 요청 허용
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    /**
     * 회원가입 (Sign Up)
     * 프론트엔드에서 보내는 데이터: { "userid": "...", "password": "...", "email": "...", "age": 20, "gender": "M" }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member member) {
        // 1. 중복 아이디 체크 (userid 기준)
        if (memberRepository.existsByUserid(member.getUserid())) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 존재하는 아이디입니다."); // 400 Error
        }

        // 2. 저장 (회원가입 완료)
        Member savedMember = memberRepository.save(member);
        return ResponseEntity.ok(savedMember); // 200 OK
    }

    /**
     * 로그인 (Login)
     * 프론트엔드에서 보내는 데이터: { "userid": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        // 1. 아이디(userid)로 회원 조회
        Member foundMember = memberRepository.findByUserid(member.getUserid())
                .orElse(null);

        // 2. 회원이 없거나, 비밀번호가 틀리면 에러 리턴
        if (foundMember == null || !foundMember.getPassword().equals(member.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body("아이디 또는 비밀번호가 일치하지 않습니다."); // 401 Unauthorized
        }

        // 3. 로그인 성공! (회원 정보 반환)
        return ResponseEntity.ok(foundMember);
    }

    /**
     * 아이디 찾기 (Find ID)
     * 프론트엔드에서 보내는 데이터: { "email": "..." }
     */
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Member member) {
        Member foundMember = memberRepository.findByEmail(member.getEmail())
                .orElse(null);

        if (foundMember != null) {
            // 아이디만 리턴해줍니다.
            return ResponseEntity.ok(foundMember.getUserid());
        } else {
            return ResponseEntity
                    .status(404)
                    .body("해당 이메일로 가입된 회원이 없습니다.");
        }
    }
}
