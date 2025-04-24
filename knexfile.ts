// Update with your config settings.

/**
//  * @type { Object.<string, import("knex").Knex.Config> }
 */
import type { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2", // or 'mysql2', 'sqlite3', etc.
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
  test: {
    client: "sqlite3", // simpler in test env
    connection: {
      filename: ":memory:", // in-memory DB for tests
    },
    useNullAsDefault: true, // Important for SQLite
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },
  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./dist/database/migrations",
    },
    seeds: {
      directory: "./dist/database/seeds",
    },
  },
};

export default config;