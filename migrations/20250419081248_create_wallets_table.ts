import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("wallets", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("wallet_number").unique().notNullable();
    table.decimal("balance", 15, 2).defaultTo(0.0);
    table.string("currency").defaultTo("NGN"); // Or your default currency
    table.boolean("is_active").defaultTo(true);
    table.string("status").defaultTo("active"); // active, frozen, suspended
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("wallets");
}
