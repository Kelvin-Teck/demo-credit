import type { Knex } from "knex";
import dotenv from 'dotenv'
dotenv.config()
// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config: { [key: string]: import("knex").Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      user: process.env.DB_USER,
      password: (process.env.DB_PASSWORD as string) || "",
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./database/migrations",
    },
  },

  staging: {
    client: "mysql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "mysql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/database/migrations",
    },
  },
};

export default config