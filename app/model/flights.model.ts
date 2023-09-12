import pool from "../db/database";

interface Flight {
  id: number;
  title: string;
  company_id: number;
}

const FlightModel = {
  getAll: async (): Promise<Flight[]> => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM flights");
      client.release();
      return result.rows as Flight[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getByCompanyId: async (companyId: number): Promise<Flight[]> => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM flights where company_id = $1",
        [companyId]
      );
      client.release();
      return result.rows as Flight[];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  create: async (title: string, company_id: number): Promise<void> => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "INSERT INTO flights (title, company_id) VALUES ($1, $2)",
        [title, company_id]
      );
      client.release();
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default FlightModel;
