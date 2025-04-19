// src/models/Wallet.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { v4 as uuidv4 } from "uuid";
import { WalletData } from "../interfaces";


class Wallet extends BaseModel {
  protected static tableName = "wallets";

  // Generate unique wallet number
  static generateWalletNumber() {
    return `WAL-${uuidv4().substring(0, 8).toUpperCase()}`;
  }

  // Create wallet with generated wallet number
  static async create(walletData: WalletData) {
    const wallet = {
      ...walletData,
      wallet_number: walletData.wallet_number || this.generateWalletNumber(),
      balance: walletData.balance || 0,
      currency: walletData.currency || "NGN",
      status: walletData.status || "active",
    };

    const [id] = await knex(this.tableName).insert(wallet).returning("id");
    return this.findById(id);
  }

  // Get wallet by user id
  static async findByUserId(userId: number) {
    return knex(this.tableName).where({ user_id: userId }).first();
  }

  // Update wallet balance
  static async updateBalance(id: number, amount: number) {
    const wallet = await this.findById(id);
    if (!wallet) throw new Error("Wallet not found");

    const newBalance = wallet.balance + amount;

    // Ensure balance doesn't go below 0
    if (newBalance < 0) throw new Error("Insufficient funds");

    await knex(this.tableName).where({ id }).update({
      balance: newBalance,
      updated_at: new Date(),
    });

    return this.findById(id);
  }
}

export default Wallet;
