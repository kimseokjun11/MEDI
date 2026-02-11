package model;

import lombok.Data;
import java.util.List;

@Data
public class DrugResponse {
    private Header header;
    private Body body;

    @Data
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    public static class Body {
        private int pageNo;
        private int totalCount;
        private int numOfRows;
        private List<Item> items;
    }

    @Data
    public static class Item {
        private String entpName;
        private String itemName;
        private String efcyQesitm;
        private String useMethodQesitm;
        private String atpnQesitm;
        private String itemImage;
    }
}