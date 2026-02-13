package service;

import model.Member;
import repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    // 전체 조회
    public List<Member> getAll() {
        return memberRepository.findAll();
    }

    // 단건 조회
    public Member getById(Long id) {
        return memberRepository.findById(id).orElse(null);
    }

    public Member getByUserid(String userid) {
        return memberRepository.findByUserid(userid).orElse(null);
    }

    // 🔥 회원가입 (중복 검사 추가)
    public Member create(Member member) {

        // 1️⃣ 아이디 중복 검사
        if (memberRepository.findByUserid(member.getUserid()).isPresent()) {
            throw new RuntimeException("이미 존재하는 아이디입니다.");
        }

        // 2️⃣ 이메일 중복 검사 추가
        if (memberRepository.findByEmail(member.getEmail()).isPresent()) {
            throw new RuntimeException("이미 가입된 이메일입니다.");
        }

        return memberRepository.save(member);
    }

    public void delete(Long id) {
        memberRepository.deleteById(id);
    }
}
