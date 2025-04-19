// src/models/Transaction.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { v4 as uuidv4 } from "uuid";
import { TransactionData } from "../interfaces";


class Transaction extends BaseModel {
  protected static tableName = "transactions";

  // Generate unique transaction reference
  static generateReference() {
    return `TXN-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
  }

  // Create transaction with generated reference
  static async create(transactionData: TransactionData) {
    const transaction = {
      ...transactionData,
      reference: transactionData.reference || this.generateReference(),
      status: transactionData.status || "pending",
    };

    const [id] = await knex(this.tableName).insert(transaction).returning("id");
    return this.findById(id);
  }

  // Get user transactions
  static async findByUserId(userId: number) {
    return knex(this.tableName)
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  }

  // Get wallet transactions
  static async findByWalletId(walletId: number) {
    return knex(this.tableName)
      .where({ wallet_id: walletId })
      .orderBy("created_at", "desc");
  }

  // Get loan transactions
  static async findByLoanId(loanId: number) {
    return knex(this.tableName)
      .where({ loan_id: loanId })
      .orderBy("created_at", "desc");
  }

  // Update transaction status
  static async updateStatus(id: number, status: string, updateData = {}) {
    await knex(this.tableName)
      .where({ id })
      .update({
        status,
        ...updateData,
        updated_at: new Date(),
      });

    return this.findById(id);
  }

  // Get transaction by reference
  static async findByReference(reference: string) {
    return knex(this.tableName).where({ reference }).first();
  }
}

export default Transaction;
