package service;

/**
 * 공공데이터 DUR API 호출이 실패했을 때 던진다.
 * "결과 없음"과 "조회 실패"를 구분하기 위해 빈 목록 대신 사용한다.
 */
public class DurApiException extends RuntimeException {

    public DurApiException(String message) {
        super(message);
    }

    public DurApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
