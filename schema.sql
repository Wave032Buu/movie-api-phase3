-- สร้างฐานข้อมูลและเลือกใช้งาน
CREATE DATABASE IF NOT EXISTS movie_api;
USE movie_api;

-- 1. ตารางผู้กำกับ (Directors)
CREATE TABLE directors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE, -- กำหนดให้ชื่อผู้กำกับห้ามซ้ำ
  birth_year INT
);

-- 2. ตารางภาพยนตร์ (Movies)
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  release_year INT NOT NULL,
  director_id INT NOT NULL,
  FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE,
  -- ป้องกันไม่ให้มีหนังชื่อเดียวกันในปีเดียวกันซ้ำ (Composite Unique Key)
  UNIQUE KEY unique_movie (title, release_year)
);

-- 3. ตารางรีวิว (Reviews)
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10), -- บังคับให้คะแนนอยู่ระหว่าง 1-10
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
);