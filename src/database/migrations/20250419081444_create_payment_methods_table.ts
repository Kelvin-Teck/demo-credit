import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("payment_methods", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("payment_type").notNullable(); // bank_account, card, mobile_money
    table.string("provider").notNullable(); // bank name, card type, mobile money provider
    table.string("account_number").nullable();
    table.string("bank_code").nullable();
    table.string("card_last_four").nullable();
    table.string("card_expiry").nullable();
    table.string("token").nullable(); // Payment provider token
    table.boolean("is_default").defaultTo(false);
    table.boolean("is_verified").defaultTo(false);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("payment_methods");
}
