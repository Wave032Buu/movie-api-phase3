require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

// 1. นำเข้า Service สำหรับ External API (OMDB Resilience) และการเชื่อมต่อฐานข้อมูล
const { fetchMovieDataWithResilience } = require("./services/external-api");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// 2. Middlewares พื้นฐาน (cors สำคัญมาก เพื่อให้ frontend/index.html เรียก API ได้)
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 3. ตั้งค่า Swagger Documentation (โหลดไฟล์ openapi.yaml)
try {
  const swaggerDocument = YAML.load(path.join(__dirname, "openapi.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("✅ โหลดไฟล์ openapi.yaml และตั้งค่า Swagger สำเร็จ");
} catch (error) {
  console.error("❌ โหลดไฟล์ openapi.yaml ไม่สำเร็จ:", error.message);
}

// เช็คสถานะเซิร์ฟเวอร์
app.get("/", (req, res) => {
  res.status(200).json({ message: "Movie API Phase 3 พร้อมใช้งาน" });
});

// ==========================================
// API Endpoints สำหรับ Movie Management System
// ==========================================

// Endpoint 1 (GET): ดึงรายการภาพยนตร์ทั้งหมด
app.get("/api/movies", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.id, m.title, m.release_year, d.name AS director_name
      FROM movies m
      LEFT JOIN directors d ON m.director_id = d.id
      ORDER BY m.id ASC
    `);
    res.status(200).json({ message: "ดึงข้อมูลภาพยนตร์สำเร็จ", data: rows });
  } catch (err) {
    next(err);
  }
});

// Endpoint 2 (GET): ดึงข้อมูลภาพยนตร์รายเรื่อง + External API Resilience (OMDB)
app.get("/api/movies/:id", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบภาพยนตร์ในระบบ" });
    }
    const movie = rows[0];

    // เรียกฟังก์ชัน Resilience ที่มี Timeout, Retry 2 ครั้ง และ Fallback
    const externalData = await fetchMovieDataWithResilience(movie.title);

    res.status(200).json({
      message: "ดึงข้อมูลสำเร็จ",
      data: {
        id: movie.id,
        title: movie.title,
        release_year: movie.release_year,
        external_info: externalData
      }
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint 3 (POST): เพิ่มภาพยนตร์ใหม่ (รองรับการส่งฟอร์มจาก Frontend)
app.post("/api/movies", async (req, res, next) => {
  try {
    const { title, release_year, director_id = 1 } = req.body;
    if (!title || !release_year) {
      return res.status(400).json({ error: "กรุณาระบุชื่อภาพยนตร์และปีที่ฉายให้ครบถ้วน" });
    }

    const [result] = await pool.query(
      "INSERT INTO movies (title, release_year, director_id) VALUES (?, ?, ?)",
      [title, release_year, director_id]
    );

    res.status(201).json({
      message: "เพิ่มภาพยนตร์สำเร็จ",
      data: { id: result.insertId, title, release_year, director_id }
    });
  } catch (err) {
    next(err);
  }
});

// Endpoint 4 (DELETE): ลบภาพยนตร์ตาม ID
app.delete("/api/movies/:id", async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM movies WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบภาพยนตร์ที่ต้องการลบ" });
    }
    res.status(200).json({ message: "ลบภาพยนตร์สำเร็จ" });
  } catch (err) {
    next(err);
  }
});

// Endpoint 5 (GET): จำลอง Microservice Integration (Review Service สัปดาห์ที่ 13)
app.get("/api/movies/:id/reviews", (req, res) => {
  const movieId = Number(req.params.id);
  res.status(200).json({
    service: "review-microservice",
    movie_id: movieId,
    reviews: [
      { id: 101, reviewer: "Alice", comment: "เนื้อเรื่องเข้มข้นมาก โปรดักชันยอดเยี่ยม", score: 5 },
      { id: 102, reviewer: "Bob", comment: "คุ้มค่าตั๋ว แนะนำให้ดูในโรงภาพยนตร์", score: 4 }
    ]
  });
});

// 4. Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "เกิดข้อผิดพลาดในการเชื่อมต่อหรือประมวลผลข้อมูล",
    },
  });
});

// 5. เริ่มต้นเซิร์ฟเวอร์
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Movie API Server กำลังทำงานที่พอร์ต ${PORT}`);
    console.log(`📄 เอกสาร Swagger UI: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;