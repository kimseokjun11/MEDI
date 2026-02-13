package model;

/**
 * 병용금기 체크 결과 DTO
 * - withDrug: "A + B" 형태의 표시용 문자열
 * - level: UI 표시용 레벨(예: "금지")
 * - description: DUR API의 PROHBT_CONTENT (금지 사유)
 */
public record DurTabooWarningDto(
        String withDrug,
        String level,
        String description
) {}
