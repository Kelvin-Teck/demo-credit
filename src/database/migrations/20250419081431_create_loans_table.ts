import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("loans", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("amount", 15, 2).notNullable();
    table.decimal("interest_rate", 8, 2).notNullable(); // Percentage
    table.decimal("total_repayment_amount", 15, 2).notNullable();
    table.integer("tenure").notNullable(); // Duration in days
    table.date("start_date").notNullable();
    table.date("due_date").notNullable();
    table.string("status").defaultTo("pending"); // pending, approved, disbursed, active, paid, defaulted
    table.decimal("amount_repaid", 15, 2).defaultTo(0.0);
    table.string("purpose").nullable();
    table.string("rejection_reason").nullable();
    table
      .integer("approved_by")
      .unsigned()
      .references("id")
      .inTable("users")
      .nullable();
    table.timestamp("approved_at").nullable();
    table.timestamp("disbursed_at").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("loans");
}
