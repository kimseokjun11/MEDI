package model;

import java.util.List;

/**
 * ✅ 프론트가 페이지네이션 UI를 만들 수 있도록
 *  - items: 현재 페이지의 약국 목록
 *  - pageNo: 현재 페이지 번호
 *  - numOfRows: 한 페이지당 개수
 *  - totalCount: 전체 검색 결과 개수 (외부 API가 내려줌)
 *  - totalPages: 전체 페이지 수 (백엔드에서 계산)
 *  - hasNext: 다음 페이지가 있는지 (백엔드에서 계산)
 */
public record PharmacyPageResponse(
        List<Pharmacy> items,
        int pageNo,
        int numOfRows,
        int totalCount,
        int totalPages,
        boolean hasNext
) {}
