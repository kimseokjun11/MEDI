package model;

import java.util.List;

/**
 * 병용금기 체크 요청 Body
 */
public record DurTabooCheckRequest(
        List<String> itemSeqs
) {}
