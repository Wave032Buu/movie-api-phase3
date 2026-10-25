# รายงานโครงงานระยะที่ 3 (Final Integration & CLO Checklist)

## 1. รายงาน Test Coverage Baseline
จากการรันชุดทดสอบด้วยคำสั่ง `npx jest --coverage` มีสรุปผลการครอบคลุมของโค้ดดังนี้:

| ไฟล์ (File) | % Stmts | % Branch | % Funcs | % Lines | จุดที่ยังไม่มี Test ครอบคลุม (Uncovered Lines) |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **index.js** | 84.61% | 75.00% | 85.71% | 84.61% | บล็อก `catch (err)` ของ Database Connection Error (บรรทัดที่เกิด 500 Internal Server Error) |
| **services/external-api.js** | 90.00% | 83.33% | 100.00% | 90.00% | กรณีที่ OMDB API คืนค่าสำเร็จแบบไม่มี Plot (เนื่องจากจำลองโหมด Failure Scenario เป็นหลัก) |
| **รวม (All files)** | **86.50%** | **78.50%** | **90.00%** | **86.50%** | - |

---

## 2. ตารางตรวจสอบความครบถ้วนตามข้อกำหนด (CLO Requirements Checklist)

| CLO / PLO | ข้อกำหนด (Requirement) | สถานะ | หลักฐานอ้างอิงในโปรเจกต์ (File & Line Reference) |
| :--- | :--- | :---: | :--- |
| **CLO8 (PLO14)** | **1.1 ระบบรวมทำงานได้จริง (Full Stack Sync):** รวมระบบฐานข้อมูล, External API และ Microservice เข้าด้วยกันโดยไม่มี Conflict | ✅ ครบถ้วน | ไฟล์ `index.js` (บรรทัดที่ 1-118) และ `db.js` เชื่อมต่อ MySQL Pool และรันผ่านพอร์ต 3000 ได้สมบูรณ์ |
| **CLO8 (PLO14)** | **1.2 เอกสารตรงกับโค้ดจริง (Swagger/Code Match):** อัปเดต OpenAPI 3.0 ให้ตรงกับ Path และ Method ล่าสุดทั้งหมด | ✅ ครบถ้วน | ไฟล์ `openapi.yaml` และแสดงผลที่ `GET /api-docs` (`index.js` บรรทัดที่ 21-25) |
| **CLO8 (PLO14)** | **1.3 การเชื่อมต่อ External API & Resilience:** มี Timeout (3s), Retry (2 ครั้ง) และ Fallback เมื่อระบบภายนอกล้มเหลว | ✅ ครบถ้วน | ไฟล์ `services/external-api.js` (บรรทัดที่ 7-45) และบันทึกผลใน `failure-scenario-results.md` |
| **CLO8 (PLO14)** | **1.4 รายงาน Test Coverage Baseline:** สรุปเปอร์เซ็นต์และระบุจุดที่ยังไม่มี Test ครอบคลุม | ✅ ครบถ้วน | ไฟล์ `phase3-report.md` (หัวข้อที่ 1 ด้านบน) |
| **CLO6 (PLO10)** | **2.1 Frontend เรียกใช้ API จริงอย่างน้อย 3 Endpoints:** ครอบคลุมทั้งการอ่าน (GET) และการเปลี่ยนแปลงข้อมูล (POST, DELETE) | ✅ ครบถ้วน | ไฟล์ `index.html`:<br>- `GET /api/movies` (บรรทัดที่ 98)<br>- `POST /api/movies` (บรรทัดที่ 165)<br>- `GET /api/movies/:id` (บรรทัดที่ 192)<br>- `DELETE /api/movies/:id` (บรรทัดที่ 213) |
| **CLO6 (PLO10)** | **2.2 การจัดการสถานะ Loading และ Error บน UI:** แสดง Spinner ตอนโหลด และแสดงกล่องข้อความแจ้งเตือนเมื่อเกิดข้อผิดพลาด | ✅ ครบถ้วน | ไฟล์ `index.html` ฟังก์ชัน `showStatus()` (บรรทัดที่ 84-92) และ `#loadingIndicator` (บรรทัดที่ 60-63) |
| **CLO6 (PLO10)** | **2.3 แบบฟอร์มรับข้อมูลพร้อม Client-side Validation:** ตรวจสอบความยาวชื่อเรื่องและช่วงปีที่ฉาย (1888-2030) ก่อนส่งข้อมูล | ✅ ครบถ้วน | ไฟล์ `index.html` ฟังก์ชัน `handleCreateMovie()` (บรรทัดที่ 144-158) |
| **CLO7 (PLO13)** | **3.1 การนำเสนอและตอบคำถาม (Project Defense):** เตรียมสาธิตการทำงานแบบ End-to-End ตั้งแต่หน้าบ้านถึงฐานข้อมูล | ✅ พร้อมนำเสนอ | สาธิตผ่านหน้าเว็บ `index.html`, หน้าเอกสาร `/api-docs` และผลการจำลอง Failure Scenario |