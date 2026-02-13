package model;

/**
 * DUR 품목 검색 결과 DTO
 * - itemSeq: 의약품 품목일련번호
 * - itemName: 의약품명
 * - entpName: 업체명
 */
public record DurItemDto(
        String itemSeq,
        String itemName,
        String entpName
) {}
