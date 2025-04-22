import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     return knex.schema.createTable("transactions", function (table) {
       table.increments("id").primary();
       table
         .integer("user_id")
         .unsigned()
         .references("id")
         .inTable("users")
         .notNullable();
       table
         .integer("wallet_id")
         .unsigned()
         .references("id")
         .inTable("wallets")
         .notNullable();
       table.string("reference").unique().notNullable();
       table.decimal("amount", 15, 2).notNullable();
       table.string("transaction_type").notNullable(); // deposit, withdrawal, loan_disbursement, loan_repayment, transfer
       table.string("status").defaultTo("pending"); // pending, completed, failed
       table
         .integer("source_wallet_id")
         .unsigned()
         .references("id")
         .inTable("wallets")
         .nullable();
       table
         .integer("destination_wallet_id")
         .unsigned()
         .references("id")
         .inTable("wallets")
         .nullable();
       table
         .integer("loan_id")
         .unsigned()
         .references("id")
         .inTable("loans")
         .nullable();
       table.string("payment_method").nullable(); // bank_transfer, card, wallet, etc.
       table.json("payment_details").nullable(); // Store payment gateway response
       table.string("description").nullable();
       table.string("failure_reason").nullable();
       table.timestamps(true, true);
     });
}


export async function down(knex: Knex): Promise<void> {
return knex.schema.dropTable("transactions");
}

