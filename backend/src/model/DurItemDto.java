package model;

/**
 * DUR 품목 검색 결과 DTO (확장)
 */
public record DurItemDto(
        String itemSeq,
        String itemName,
        String entpName,

        String materialName,   // ⭐ 성분
        String chart,          // ⭐ 제형 설명
        String storageMethod,  // ⭐ 보관법
        String validTerm       // ⭐ 유효기간
) {}