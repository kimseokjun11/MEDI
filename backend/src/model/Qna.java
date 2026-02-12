package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String writer;

    private boolean secret;     // ⭐ 비밀글 여부
    private boolean answered;   // ⭐ 답변 완료 여부

    @Column(columnDefinition = "TEXT")
    private String answer;      // ⭐ 관리자 답변

    private LocalDateTime date;

    @OneToMany(mappedBy = "qna", cascade = CascadeType.ALL)
    private List<QnaComment> comments;

    @PrePersist
    public void prePersist() {
        this.date = LocalDateTime.now();
        this.answered = false;
    }
}
