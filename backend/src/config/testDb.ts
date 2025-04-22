// src/config/testDb.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const pool = new Pool({ /* same config */ });

pool.connect()
  .then(() => console.log("✅ Test DB connected"))
  .catch((err: any) => console.error("❌ Test DB connection failed:", err));


export default pool;
