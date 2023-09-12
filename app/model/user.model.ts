import { Pool } from "pg";
import pool from "../db/database";
import bcrypt from "bcryptjs";
import FlightModel from "./flights.model";
import TenantsModel from "./tenant.model";

interface User {
  id: number;
  email: string;
  password: string;
  company_id: number;
}

interface Flight {
  id: number;
  title: string;
  company_id: number;
}

const UserModel = {
  getAll: async (): Promise<User[]> => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM users");
      client.release();
      return result.rows as User[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getUserFromTenants: async (email: string): Promise<any> => {
    const tenantDatabases = await TenantsModel.getTenantDatabases();

    // console.log("tenantDatabases", tenantDatabases);
    const users = [];
    for (const dbName of tenantDatabases) {
      const user = await TenantsModel.getUserInDatabase(dbName, email);
      // console.log("user", user);

      if (user) {
        users.push(user);
      }
    }
    return users;
  },

  // getFlightsFromTenants: async (email: string): Promise<any> => {
  //   const tenantDatabases = await TenantsModel.getTenantDatabases();

  //   console.log("tenantDatabases_flights", tenantDatabases);
  //   const flights = [];
  //   for (const dbName of tenantDatabases) {
  //     const flight = await TenantsModel.getFlightsInDatabase(dbName, email);
  //     flights.push(flight);
  //   }
  //   return flights;
  // },

  getUser: async (email: string): Promise<User[] | null> => {
    try {
      const usersFromTenants = await UserModel.getUserFromTenants(email);

      if (usersFromTenants.length > 0) {
        return usersFromTenants;
      }

      const client = await pool.connect();

      const result = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      client.release();
      return result.rows as User[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // getFlightsForUserByEmail: async (email: string): Promise<Flight[]> => {
  //   try {
  //     const client = await pool.connect();
  //     const tenantDatabases = await TenantsModel.getTenantDatabases();
  //     // console.log("tenantDatabases", tenantDatabases);
  //     const users = [];
  //     let dbNameCheck;
  //     for (const dbName of tenantDatabases) {
  //       console.log("dbName", dbName);
  //     }
  //     const query = `
  //       SELECT flights.*,companies.name as company_name
  //       FROM flights
  //       JOIN companies ON flights.company_id = companies.id
  //       JOIN users ON users.company_id = companies.id
  //       WHERE users.email = $1
  //     `;

  //     const result = await client.query(query, [email]);
  //     console.log("result", result);

  //     client.release();
  //     const flights = result.rows as Flight[];
  //     return flights;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // },

  create: async (
    email: string,
    password: string,
    company_id: number
  ): Promise<void> => {
    try {
      const client = await pool.connect();
      const hashpassword = await bcrypt.hash(password, 10);
      // console.log("hashpassword", hashpassword);

      await client.query(
        "INSERT INTO users (email,password, company_id) VALUES ($1, $2, $3)",
        [email, hashpassword, company_id]
      );
      client.release();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default UserModel;
