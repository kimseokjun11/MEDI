import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Spring Boot 메인 애플리케이션
 * 폴더 구조를 변경하지 않기 위해 각 패키지 위치를 명시적으로 지정함
 */
@SpringBootApplication(scanBasePackages = {"controller", "service", "repository", "config", "filter"})
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
}
