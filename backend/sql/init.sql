-- 데이터베이스 초기화 스크립트
create database bu_dev4;
create user 'bu_dev4'@'%' identified by 'bu_dev4';
grant all privileges on bu_dev4.* to 'bu_dev4'@'%';
flush privileges;

-- Member 테이블 생성
CREATE TABLE IF NOT EXISTS member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Board 테이블 생성
CREATE TABLE IF NOT EXISTS board (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    writer VARCHAR(50) NOT NULL,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입 (Member)
INSERT INTO member (username, password, name) VALUES 
('admin', 'admin123', '관리자'),
('user1', 'pass123', '사용자1'),
('user2', 'pass123', '사용자2');

-- 샘플 데이터 삽입 (Board)
INSERT INTO board (title, content, writer) VALUES 
('첫 번째 게시글', '첫 번째 게시글 내용입니다.', 'admin'),
('두 번째 게시글', '두 번째 게시글 내용입니다.', 'user1'),
('세 번째 게시글', '세 번째 게시글 내용입니다.', 'user2'),
('공지사항', '중요한 공지사항입니다.', 'admin'),
('질문있습니다', '이것은 어떻게 사용하나요?', 'user1');
