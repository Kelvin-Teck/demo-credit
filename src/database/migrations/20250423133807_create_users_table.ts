import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique();
    table.string("phone_number").notNullable().unique();
    table.string("password").notNullable();
    table.string("address").nullable();
    table.date("date_of_birth").nullable();
    table.string("id_number").nullable(); // National ID or similar
    table.string("verification_status").defaultTo("unverified"); // unverified, pending, verified
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
