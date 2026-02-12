package controller;

import model.Member;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.MailService;
import java.util.Map;
import java.util.Optional; 
/**
 * 회원 관련 요청을 처리하는 컨트롤러
 * (기존 기능 유지 + 관리자 권한 기능 연동)
 */
@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*") 
public class MemberController {


    // 1. 내 정보 가져오기 (마이페이지용)
@GetMapping("/me")
public ResponseEntity<?> getMyInfo(@RequestParam String userid) {
    Optional<Member> member = memberRepository.findByUserid(userid);
    
    // Optional 체이닝 대신 if-else로 타입을 확실히 분리
    if (member.isPresent()) {
        return ResponseEntity.ok(member.get()); // ResponseEntity<Member> 반환
    } else {
        return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다."); // ResponseEntity<String> 반환
    }
}

// 2. 정보 수정 (비밀번호, 이메일 포함)
@PutMapping("/update")
public ResponseEntity<?> updateMember(@RequestBody Map<String, String> payload) {
    String userid = payload.get("userid");
    String newPassword = payload.get("password");
    String email = payload.get("email");

    Optional<Member> memberOpt = memberRepository.findByUserid(userid);
    
    if (memberOpt.isPresent()) {
        Member member = memberOpt.get();
        
        // 값이 존재할 때만 업데이트
        if (newPassword != null && !newPassword.isEmpty()) {
            member.setPassword(newPassword);
        }
        if (email != null && !email.isEmpty()) {
            member.setEmail(email);
        }
        
        memberRepository.save(member);
        return ResponseEntity.ok("정보가 수정되었습니다.");
    } else {
        return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
    }
}   
    @Autowired
    private MailService mailService;

    // ✅ 비밀번호 찾기 (아이디+이메일 입력 -> 임시비번 메일 발송)
    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> payload) {
        String userid = payload.get("userid");
        String email = payload.get("email");

        Member member = memberRepository.findByUseridAndEmail(userid, email).orElse(null);

        if (member != null) {
            // 1. 임시 비밀번호 생성
            String tempPw = mailService.getTempPassword();
            
            // 2. DB 업데이트
            member.setPassword(tempPw); 
            memberRepository.save(member);

            // 3. 메일 발송
            mailService.sendMail(email, "[MEDI] 임시 비밀번호 안내", "임시 비밀번호: " + tempPw + "\n로그인 후 변경해주세요.");
            
            return ResponseEntity.ok("임시 비밀번호가 발송되었습니다.");
        } else {
            return ResponseEntity.status(404).body("정보가 일치하지 않습니다.");
        }
    }
    
    @Autowired
    private MemberRepository memberRepository;

    /**
     * 회원가입 (Sign Up)
     * 데이터: { "userid": "...", "password": "...", ... }
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member member) {
        // 1. 중복 아이디 체크
        if (memberRepository.existsByUserid(member.getUserid())) {
            return ResponseEntity
                    .badRequest()
                    .body("이미 존재하는 아이디입니다.");
        }

        // 🔒 [보안 추가] 회원가입 시 권한은 무조건 'USER'로 강제 설정
        // (프론트에서 { "role": "ADMIN" }을 보내도 무시하고 USER로 저장됨)
        member.setRole("USER");

        // 2. 저장
        Member savedMember = memberRepository.save(member);
        return ResponseEntity.ok(savedMember);
    }

    /**
     * 로그인 (Login)
     * 데이터: { "userid": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member member) {
        // 1. 아이디로 조회
        Member foundMember = memberRepository.findByUserid(member.getUserid())
                .orElse(null);

        // 2. 비번 체크
        if (foundMember == null || !foundMember.getPassword().equals(member.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공! 
        // ⭐ 여기서 반환되는 foundMember 안에 'role' 정보(USER or ADMIN)가 들어있음
        // 프론트엔드는 이 정보를 보고 페이지를 이동시킴
        return ResponseEntity.ok(foundMember);
    }

    /**
     * 아이디 찾기 (Find ID)
     * 데이터: { "email": "..." }
     */
    @PostMapping("/find-id")
    public ResponseEntity<?> findId(@RequestBody Member member) {
        Member foundMember = memberRepository.findByEmail(member.getEmail())
                .orElse(null);

        if (foundMember != null) {
            return ResponseEntity.ok(foundMember.getUserid());
        } else {
            return ResponseEntity
                    .status(404)
                    .body("해당 이메일로 가입된 회원이 없습니다.");
        }
    }

    
}
