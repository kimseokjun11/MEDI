package controller;

import model.Member;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.MailService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MailService mailService;

    /* ==========================
       1️⃣ 내 정보 조회
    ========================== */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestParam String userid) {
        Optional<Member> member = memberRepository.findByUserid(userid);

        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        } else {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
    }

    /* ==========================
       2️⃣ 회원 정보 수정
    ========================== */
    @PutMapping("/update")
    public ResponseEntity<?> updateMember(@RequestBody Map<String, String> payload) {

        String userid = payload.get("userid");
        String newPassword = payload.get("password");
        String email = payload.get("email");

        Optional<Member> memberOpt = memberRepository.findByUserid(userid);

        if (memberOpt.isPresent()) {

            Member member = memberOpt.get();

            if (newPassword != null && !newPassword.isEmpty()) {
                member.setPassword(newPassword);
            }

            if (email != null && !email.isEmpty()) {

                // 🔥 이메일 중복 체크 추가
                if (memberRepository.existsByEmail(email)
                        && !member.getEmail().equals(email)) {
                    return ResponseEntity
                            .badRequest()
                            .body("이미 사용 중인 이메일입니다.");
                }

                member.setEmail(email);
            }

            memberRepository.save(member);
            return ResponseEntity.ok("정보가 수정되었습니다.");

        } else {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
    }

    /* ==========================
       3️⃣ 회원가입
    ========================== */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member member) {

        // 1️⃣ 아이디 중복 체크
        if (memberRepository.existsByUserid(member.getUserid())) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 존재하는 아이디입니다.");
        }

        // 2️⃣ 이메일 중복 체크 🔥 추가
        if (memberRepository.existsByEmail(member.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 가입된 이메일입니다.");
        }

        // 3️⃣ 권한 강제 USER
        member.setRole("USER");

        Member savedMember = memberRepository.save(member);

        return ResponseEntity.ok(savedMember);
    }

    /* ==========================
       4️⃣ 로그인
    ========================== */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {

        Member foundMember = memberRepository
                .findByUserid(member.getUserid())
                .orElse(null);

        if (foundMember == null ||
                !foundMember.getPassword().equals(member.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        return ResponseEntity.ok(foundMember);
    }

    /* ==========================
       5️⃣ 아이디 찾기
    ========================== */
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Member member) {

        Member foundMember = memberRepository
                .findByEmail(member.getEmail())
                .orElse(null);

        if (foundMember != null) {
            return ResponseEntity.ok(foundMember.getUserid());
        } else {
            return ResponseEntity
                    .status(404)
                    .body("해당 이메일로 가입된 회원이 없습니다.");
        }
    }

    /* ==========================
       6️⃣ 비밀번호 찾기
    ========================== */
    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> payload) {

        String userid = payload.get("userid");
        String email = payload.get("email");

        Member member = memberRepository
                .findByUseridAndEmail(userid, email)
                .orElse(null);

        if (member != null) {

            String tempPw = mailService.getTempPassword();

            member.setPassword(tempPw);
            memberRepository.save(member);

            mailService.sendMail(
                    email,
                    "[MEDI] 임시 비밀번호 안내",
                    "임시 비밀번호: " + tempPw + "\n로그인 후 변경해주세요."
            );

            return ResponseEntity.ok("임시 비밀번호가 발송되었습니다.");

        } else {
            return ResponseEntity
                    .status(404)
                    .body("정보가 일치하지 않습니다.");
        }
    }
}
