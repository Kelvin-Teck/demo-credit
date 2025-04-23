// src/models/Transaction.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { v4 as uuidv4 } from "uuid";
import { ITransactionData } from "../interfaces";

class Transaction extends BaseModel {
  protected static tableName = "transactions";

  // Generate unique transaction reference
  static generateReference() {
    return `TXN-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
  }

  // static async findById(id: number, trx?: any): Promise<any> {
  //   const queryBuilder = trx ? trx(this.tableName) : knex(this.tableName);

  //   const transaction = await queryBuilder.where({ id }).first();

  //   return transaction
  // }

  // Create transaction with generated reference
  static async create(transactionData: ITransactionData, trx?: any) {
    const queryBuilder = trx ? trx(this.tableName) : knex(this.tableName);

    const transaction = {
      ...transactionData,
      reference: transactionData.reference || this.generateReference(),
      status: transactionData.status || "pending",
    };
    const query = await queryBuilder.insert(transaction);
    const [insertedId] = trx ? query.transacting(trx) : query;

    return this.findById(insertedId, trx);
  }

  // Get user transactions
  static async findByUserId(userId: number) {
    return knex(this.tableName)
      .where({ user_id: userId })
      .orderBy("created_at", "desc");
  }

  // Get wallet transactions
  static async findByWalletId(walletId: number) {
    return await knex(this.tableName)
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
  static async updateStatus(
    id: number,
    status: string,
    updateData = {},
    trx?: any
  ) {
    const queryBuilder = trx ? trx(this.tableName) : knex(this.tableName);

   const query =  await queryBuilder.where({ id }).update({
      status,
      ...updateData,
      updated_at: new Date(),
   });
    
    trx ? query.transacting(trx) : query

    return this.findById(id, trx);
  }

  // Get transaction by reference
  static async findByReference(reference: string) {
    return knex(this.tableName).where({ reference }).first();
  }
}

export default Transaction;
