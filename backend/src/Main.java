import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;

import model.Member;
import repository.MemberRepository;

/**
 * Spring Boot 메인 애플리케이션
 * 폴더 구조를 변경하지 않기 위해 각 패키지 위치를 명시적으로 지정함
 */
@SpringBootApplication(scanBasePackages = {
        "controller",
        "service",
        "repository",
        "config",
        "filter"
})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = "model")
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);

        System.out.println("========================================");
        System.out.println("🚀 Spring Boot 서버가 시작되었습니다!");
        System.out.println("접속 주소: http://localhost:8080");
        System.out.println("========================================");
    }

    /**
     * 🔥 서버 시작 시 관리자 계정 자동 생성
     */
    @Bean
    public CommandLineRunner createAdmin(MemberRepository memberRepository) {
        return args -> {

            // admin 계정 존재 여부 확인
            if (memberRepository.findByUserid("admin").isEmpty()) {

                Member admin = new Member();
                admin.setUserid("admin");
                admin.setPassword("admin123"); // 🔐 나중엔 암호화 권장
                admin.setEmail("admin@medi.com");
                admin.setAge(99);
                admin.setGender("M");
                admin.setRole("ADMIN");

                memberRepository.save(admin);

                System.out.println("🔥 기본 관리자(admin) 계정이 자동 생성되었습니다.");
            } else {
                System.out.println("✅ 관리자 계정이 이미 존재합니다.");
            }
        };
    }
}
