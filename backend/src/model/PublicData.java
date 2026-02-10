package model;

import jakarta.persistence.*;

/**
 * 공공데이터 모델
 */
@Entity
@Table(name = "public_data")
public class PublicData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String category;
    
    private String provider;
    
    @Column(name = "update_date")
    private String updateDate;

     // ✅ 추가: 건강기능식품 신고번호(고유키)
    private String sttemntNo;

    public PublicData() {}

    // Getter
    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getProvider() { return provider; }
    public String getUpdateDate() { return updateDate; }
    
    // ✅ 추가된 getter/setter
    public String getSttemntNo() { return sttemntNo; }
    

    // Setter
    public void setId(int id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setUpdateDate(String updateDate) { this.updateDate = updateDate; }
    public void setSttemntNo(String sttemntNo) { this.sttemntNo = sttemntNo; }

    @Override
    public String toString() {
        return "PublicData{id=" + id + ", title='" + title + "'}";
    }
}
