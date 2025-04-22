import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("audit_logs", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .nullable();
    table.string("entity_type").notNullable(); // user, wallet, loan, transaction
    table.integer("entity_id").notNullable();
    table.string("action").notNullable(); // create, update, delete
    table.json("old_values").nullable();
    table.json("new_values").nullable();
    table.string("ip_address").nullable();
    table.string("user_agent").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("audit_logs");
}
