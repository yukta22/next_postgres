import { Pool } from "pg";
import pool from "../db/database";
import UserModel from "./user.model";

interface Tenant {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  password: string;
  company_id: number;
}
let db: any;
const TenantsModel = {
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const client = await pool.connect();

      // Retrieve all tenants from the 'tenants' table
      const result = await client.query("SELECT * FROM tenants");

      client.release();

      return result.rows as Tenant[];
    } catch (error) {
      console.error("Error getting tenants:", error);
      throw error;
    }
  },

  getTenantDatabases: async (): Promise<string[]> => {
    const client = await pool.connect();

    try {
      const queryResult = await client.query(
        "SELECT datname FROM pg_database WHERE datname LIKE '%_tenant'"
      );
      // console.log(
      //   "queryResult",
      //   queryResult.rows.map((row) => row.datname)
      // );

      return queryResult.rows.map((row) => row.datname);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  getUserInDatabase: async (
    databaseName: string,
    email: string
  ): Promise<User | null> => {
    const client = await pool.connect();

    try {
      const poolConfig = {
        user: "root",
        host: "localhost",
        database: databaseName,
        password: "asd",
        port: 5432,
      };

      const poolInstance = new Pool(poolConfig);
      const poolClient = await poolInstance.connect();

      const queryResult = await poolClient.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      // console.log("queryResult", queryResult);

      if (queryResult.rows.length > 0) {
        db = poolConfig.database;
        return queryResult.rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      client.release();
    }
  },
  getFlightsInDatabase: async (email: string): Promise<User[] | null> => {
    const client = await pool.connect();
    console.log("db", db);
    await UserModel.getUser(email);
    try {
      const poolConfig = {
        user: "root",
        host: "localhost",
        database: db,
        password: "asd",
        port: 5432,
      };

      const poolInstance = new Pool(poolConfig);
      const poolClient = await poolInstance.connect();

      const queryResult = await poolClient.query("SELECT * FROM flights");

      if (queryResult.rows.length > 0) {
        return queryResult.rows;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

export default TenantsModel;
