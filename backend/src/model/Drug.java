package model;

public class Drug {

    private String itemName;
    private String entpName;
    private String efcyQesitm;
    private String useMethodQesitm;
    private String atpnQesitm;
    private String intrcQesitm;
    private String seQesitm;
    private String depositMethodQesitm;
    private String itemImage;

    // 기본 생성자
    public Drug() {
    }

    // ===== Getter =====

    public String getItemName() {
        return itemName;
    }

    public String getEntpName() {
        return entpName;
    }

    public String getEfcyQesitm() {
        return efcyQesitm;
    }

    public String getUseMethodQesitm() {
        return useMethodQesitm;
    }

    public String getAtpnQesitm() {
        return atpnQesitm;
    }

    public String getIntrcQesitm() {
        return intrcQesitm;
    }

    public String getSeQesitm() {
        return seQesitm;
    }

    public String getDepositMethodQesitm() {
        return depositMethodQesitm;
    }

    public String getItemImage() {
        return itemImage;
    }

    // ===== Setter =====

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setEntpName(String entpName) {
        this.entpName = entpName;
    }

    public void setEfcyQesitm(String efcyQesitm) {
        this.efcyQesitm = efcyQesitm;
    }

    public void setUseMethodQesitm(String useMethodQesitm) {
        this.useMethodQesitm = useMethodQesitm;
    }

    public void setAtpnQesitm(String atpnQesitm) {
        this.atpnQesitm = atpnQesitm;
    }

    public void setIntrcQesitm(String intrcQesitm) {
        this.intrcQesitm = intrcQesitm;
    }

    public void setSeQesitm(String seQesitm) {
        this.seQesitm = seQesitm;
    }

    public void setDepositMethodQesitm(String depositMethodQesitm) {
        this.depositMethodQesitm = depositMethodQesitm;
    }

    public void setItemImage(String itemImage) {
        this.itemImage = itemImage;
    }
}