package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class QnaComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String writer;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "qna_id")
    private Qna qna;

    @PrePersist
    public void prePersist() {
        this.date = LocalDateTime.now();
    }
}
