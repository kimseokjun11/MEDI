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
    private Long id;

    @Column(nullable = false, unique = true)
    private String userid; 

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String email;

    private Integer age;

    private String gender;

    // 👇 [추가됨] 여기가 핵심입니다! 
    // DB에 'USER'라는 기본값을 넣어주는 설정입니다.
    @Column(columnDefinition = "varchar(255) default 'USER'")
    private String role; 

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        // 혹시 몰라 자바 쪽에서도 안전장치 (비어있으면 USER로 설정)
        if (this.role == null) {
            this.role = "USER";
        }
    }
}