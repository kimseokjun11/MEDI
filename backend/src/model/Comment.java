package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String writer; // 댓글 작성자
    private String content; // 내용

    @CreationTimestamp
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "board_id") // DB에 board_id 컬럼 생성
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("comments")
    private Board board;
}