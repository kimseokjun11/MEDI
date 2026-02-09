package service;

import model.Member;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    // 전체 조회
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    // 단건 조회 (PK로 조회)
    public Member getById(Long id) {
        return memberRepository.findById(id).orElse(null);
    }

    // ★ 여기가 핵심 수정 포인트! ★
    // 기존: getByLoginId -> 변경: getByUserid
    // Repository에게도 findByUserid로 시켜야 합니다.
    public Member getByUserid(String userid) {
        return memberRepository.findByUserid(userid).orElse(null);
    }

    // 회원가입 (저장)
    public Member create(Member member) {
        return memberRepository.save(member);
    }

    // 삭제
    public void delete(Long id) {
        memberRepository.deleteById(id);
    }
}
