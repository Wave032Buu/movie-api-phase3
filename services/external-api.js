const axios = require("axios");

/**
 * ฟังก์ชันดึงข้อมูลหนังจาก OMDB
 * มีระบบ Timeout, Retry (2 ครั้ง) และ Fallback
 */
const fetchMovieDataWithResilience = async (movieTitle) => {
  // ลองตั้งใจใส่ API Key ผิดๆ หรือปล่อยว่างไว้ เพื่อทดสอบให้มัน Error (Failure Scenario)
  const apiKey = "4ddfcbd1"; 
  const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieTitle)}&apikey=${apiKey}`;
  
  const MAX_RETRIES = 2; // ลองใหม่ 2 ครั้ง
  const DELAY_MS = 1500; // หน่วงเวลา 1.5 วินาที ก่อนลองใหม่

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // 1. Timeout: กำหนดเวลารอสูงสุด 3000ms (3 วินาที)
      const response = await axios.get(url, { timeout: 3000 });
      
      // ตรวจสอบว่า OMDB แจ้ง Error กลับมาไหม (เช่น API Key ผิด)
      if (response.data.Response === "False") {
        throw new Error(response.data.Error);
      }

      // ถ้าสำเร็จ (ไม่มี Error) คืนค่าข้อมูล
      return {
        rating: response.data.imdbRating || "N/A",
        plot: response.data.Plot || "ไม่มีเรื่องย่อ"
      };

    } catch (error) {
      console.error(`[External API] ⚠️ ล้มเหลวครั้งที่ ${attempt + 1}: ${error.message}`);
      
      // 2. Retry Logic: ถ้ายิงพลาด และยังไม่ครบจำนวนโควต้า ให้รอแล้วลองใหม่
      if (attempt < MAX_RETRIES) {
        console.log(`[External API] 🔄 กำลังลองใหม่ในอีก ${DELAY_MS}ms...`);
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      } else {
        // 3. Fallback: ถ้าลองครบโควต้าแล้วยังพัง ให้คืนค่า Default ไม่ให้แอปเราพังไปด้วย
        console.error("[External API] ❌ ล้มเหลวโดยสมบูรณ์ -> ใช้งาน Fallback (ค่าเริ่มต้น)");
        return {
          rating: "N/A",
          plot: "ไม่สามารถดึงข้อมูลเรื่องย่อและคะแนนรีวิวจากระบบภายนอกได้ในขณะนี้"
        };
      }
    }
  }
};

module.exports = { fetchMovieDataWithResilience };