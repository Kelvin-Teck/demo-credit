// src/models/Wallet.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { v4 as uuidv4 } from "uuid";
import { WalletData } from "../interfaces";
import { newError } from "../utils/apiResponse";

class Wallet extends BaseModel {
  protected static tableName = "wallets";

  // Generate unique wallet number
  static generateWalletNumber() {
    return `WAL-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  // Create wallet with generated wallet number
  static async create(walletData: WalletData, trx?: any) {
    try {
      const wallet = {
        ...walletData,
        wallet_number: walletData.wallet_number || this.generateWalletNumber(),
        balance: walletData.balance || 0,
        currency: walletData.currency || "NGN",
        status: walletData.status || "active",
      };
      const queryBuilder = trx
        ? trx(this.tableName).transacting(trx)
        : knex(this.tableName);
      const [walletInserted] = await queryBuilder.insert(wallet).returning("*");

      return walletInserted;
    } catch (error) {
      console.error("Error creating wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  // Get wallet by user id
  static async findByUserId(userId: number, trx?: any) {
    const queryBuilder = trx ? trx(this.tableName).transacting(trx) : knex(this.tableName);
    const query = await queryBuilder.where({ user_id: userId })
      .first();

    return query;
  }

  static async findOne(filter: object, trx?: any) {
    const queryBuilder = trx
      ? trx(this.tableName).transacting(trx)
      : knex(this.tableName);
    return queryBuilder.where(filter).first();
  }

  // Update wallet balance
  static async updateBalance(id: number, amount: number, trx?: any) {
    const queryBuilder = trx
      ? trx(this.tableName).transacting(trx)
      : knex(this.tableName);

    const wallet = await this.findById(id);
    if (!wallet) return newError("Wallet not found", 404);

    const newBalance = parseFloat(wallet.balance) + amount;

    // Ensure balance doesn't go below 0
    if (newBalance < 0) return newError("Insufficient funds", 402);

    // await queryBuilder.where({ id }).update({
    //   balance: newBalance,
    //   updated_at: new Date(),
    // });
    // Perform the update and return the updated record in one query (MySQL supported)
    await queryBuilder.where({ id }).update({
      balance: newBalance,
      updated_at: knex.fn.now(), // Use knex's now() for database-agnostic timestamps
    });

    const updatedWallet = await this.findById(id);

    return updatedWallet;
    // Fetch the updated wallet
  }
}

export default Wallet;
