package model;

import java.util.List;

public record PublicDataPageResponse(
        List<PublicData> items,
        int pageNo,
        int numOfRows,
        int totalCount,
        boolean last
) {}
