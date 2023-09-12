import { Pool } from "pg";
import pool from "../db/database";
import bcrypt from "bcryptjs";

function generateRandomText(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomText = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
}

const Company_tenantsModel = {
  createTenantDatabase: async (
    companyName: string,
    userEmail: string,
    rules: string[],
    first_name: string,
    last_name: string,
    password: string,
    role: string
  ): Promise<void> => {
    const client = await pool.connect();

    try {
      const randomText = generateRandomText(10);
      const tenantId = Math.floor(Math.random() * 10000);
      const tenantName = `${randomText} | ${companyName} | ${userEmail}`;

      const query =
        "INSERT INTO tenants (tenant_id,tenant_name,rules) VALUES ($1,$2,$3)";
      await client.query(query, [tenantId, tenantName, rules]);

      const checkDatabaseQuery = `SELECT datname FROM pg_database WHERE datname = $1`;
      const checkDatabaseResult = await client.query(checkDatabaseQuery, [
        `${companyName.toLowerCase()}_tenant`,
      ]);

      if (checkDatabaseResult.rowCount === 0) {
        await client.query(
          `CREATE DATABASE ${companyName.toLowerCase()}_tenant`
        );
      }

      client.release();

      const newPool = await new Pool({
        user: "root",
        host: "localhost",
        database: `${companyName.toLowerCase()}_tenant`,
        password: "asd",
        port: 5432,
      }).connect();

      if (checkDatabaseResult.rowCount === 0) {
        await newPool.query(`
              CREATE TYPE user_role AS ENUM ('basic', 'admin');
    
              CREATE TABLE Users (
                  user_id SERIAL PRIMARY KEY,
                  first_name VARCHAR(255) NOT NULL,
                  last_name VARCHAR(255) NOT NULL,
                  email VARCHAR(255) NOT NULL UNIQUE,
                  password VARCHAR(255) NOT NULL,
                  role user_role NOT NULL
              );
    
              CREATE TABLE Cities (
                  city_id SERIAL PRIMARY KEY,
                  city_name VARCHAR(255) NOT NULL,
                  country VARCHAR(255) NOT NULL
              );
              
              CREATE TABLE Flights (
                  flight_id SERIAL PRIMARY KEY,
                  flights_name VARCHAR(255) NOT NULL,
                  departure_city_id INT REFERENCES Cities(city_id),
                  arrival_city_id INT REFERENCES Cities(city_id),
                  departure_time TIMESTAMP ,
                  arrival_time TIMESTAMP ,
                  price DECIMAL(10, 2) 
              );
              
              CREATE TABLE Travel_Plans (
                  plan_id SERIAL PRIMARY KEY,
                  user_id INT REFERENCES Users(user_id),
                  departure_date DATE NOT NULL,
                  return_date DATE,
                  total_price DECIMAL(10, 2) NOT NULL
              );
              
              CREATE TABLE Bookings (
                  booking_id SERIAL PRIMARY KEY,
                  user_id INT REFERENCES Users(user_id),
                  flight_id INT REFERENCES Flights(flight_id),
                  travel_plan_id INT REFERENCES Travel_Plans(plan_id),
                  booking_date TIMESTAMP NOT NULL,
                  user_name VARCHAR(255) NOT NULL,
                  seat_number VARCHAR(10) NOT NULL
              );
            `);
      }
      const hashpassword = await bcrypt.hash(password, 10);
      const userQuery =
        "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1,$2,$3, $4,$5)";
      await newPool.query(userQuery, [
        first_name,
        last_name,
        userEmail,
        hashpassword,
        role,
      ]);

      newPool.release();
    } catch (error) {
      console.error(error);
    }
  },
};

export default Company_tenantsModel;
