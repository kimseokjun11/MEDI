package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 시스템 관리용 번호 (그대로 둠)

    // 🔴 중요: 프론트엔드의 'userid'와 철자를 똑같이 맞춤!
    // 원래 loginId 였던 것을 -> userid 로 변경
    @Column(nullable = false, unique = true)
    private String userid; 

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    private Integer age;

    private String gender;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}