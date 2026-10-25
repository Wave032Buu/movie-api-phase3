USE movie_api;

-- เพิ่มข้อมูลผู้กำกับ 3 คน
INSERT INTO directors (name, birth_year) VALUES
  ('Christopher Nolan', 1970),
  ('Greta Gerwig', 1983),
  ('Bong Joon Ho', 1969);

-- เพิ่มข้อมูลภาพยนตร์ (อ้างอิงรหัสผู้กำกับ 1, 2, 3)
INSERT INTO movies (title, release_year, director_id) VALUES
  ('Inception', 2010, 1),
  ('Interstellar', 2014, 1),
  ('Barbie', 2023, 2),
  ('Parasite', 2019, 3);

-- เพิ่มข้อมูลรีวิว (อ้างอิงรหัสภาพยนตร์)
INSERT INTO reviews (movie_id, reviewer_name, rating, comment) VALUES
  (1, 'สมชาย', 10, 'หนังดีมาก ต้องดูหลายรอบถึงจะเข้าใจ'),
  (1, 'สมหญิง', 9, 'ภาพสวย เนื้อเรื่องล้ำลึก'),
  (2, 'คอหนังไซไฟ', 10, 'สุดยอดหนังอวกาศแห่งยุค'),
  (3, 'สายแฟชั่น', 8, 'สีสันสดใส เพลงเพราะมาก'),
  (4, 'นักวิจารณ์อิสระ', 10, 'เสียดสีสังคมได้เจ็บแสบมาก');