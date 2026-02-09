package filter;


import com.sun.net.httpserver.HttpExchange;

/**
 * CORS 필터 - 모든 요청에 CORS 헤더 추가
 */
public class CorsFilter {

    /**
     * CORS 헤더 설정
     * 모든 Controller에서 요청 처리 전에 호출
     */
    public static void addCorsHeaders(HttpExchange exchange) {
        // 허용할 Origin (React 개발 서버 주소)
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "http://localhost:5173");
        
        // 허용할 HTTP 메서드
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        // 허용할 헤더
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        
        // Preflight 캐시 시간 (초)
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "3600");
    }
}
