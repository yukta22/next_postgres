import pool from "../db/database";

interface Company {
  id: number;
  name: string;
}

const CompanyModel = {
  getAll: async (): Promise<Company[]> => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM companies");
      client.release();
      return result.rows as Company[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  insert: async (name: Company[]): Promise<void> => {
    try {
      const client = await pool.connect();

      await client.query("INSERT INTO companies (name) VALUES ($1)", [name]);
      client.release();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default CompanyModel;
