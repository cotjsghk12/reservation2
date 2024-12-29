-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS reservation_system;

-- 데이터베이스 사용
USE reservation_system;

-- 테이블 생성
CREATE TABLE IF NOT EXISTS Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    class_number VARCHAR(255) NOT NULL,
    UNIQUE (student_name, class_number)  -- 중복 예약 방지를 위한 제약 조건
);
