import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("loan_repayments", function (table) {
    table.increments("id").primary();
    table
      .integer("loan_id")
      .unsigned()
      .references("id")
      .inTable("loans")
      .onDelete("CASCADE");
    table
      .integer("transaction_id")
      .unsigned()
      .references("id")
      .inTable("transactions")
      .nullable();
    table.decimal("amount", 15, 2).notNullable();
    table.date("due_date").notNullable();
    table.date("payment_date").nullable();
    table.string("status").defaultTo("pending"); // pending, paid, overdue
    table.decimal("late_fee", 15, 2).defaultTo(0.0);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("loan_repayments");
}
