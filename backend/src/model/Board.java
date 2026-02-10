package model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT") // 긴 내용 저장 가능
    private String content;
    
    private String writer; // 작성자 ID
    
    private int viewCount = 0; // 조회수 (기본값 0)

    @CreationTimestamp
    private LocalDateTime date;

    // 게시글이 지워지면 댓글도 같이 삭제 (Cascade)
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    // 순환 참조 방지를 위해 댓글은 여기서 직접 JSON으로 뿌리지 않음 (필요시 DTO 사용 권장)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("board") 
    private List<Comment> comments = new ArrayList<>();
}