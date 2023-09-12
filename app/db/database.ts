import { Pool } from "pg";
const pool = new Pool({
  user: "root",
  host: "localhost",
  database: "flight_management",
  password: "asd",
  port: 5432,
});

export default pool;
