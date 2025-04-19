// src/models/PaymentMethod.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { PaymentMethodData } from "../interfaces";

class PaymentMethod extends BaseModel {
  protected static tableName = "payment_methods";

  // Find payment methods by user
  static async findByUserId(userId: number) {
    return knex(this.tableName).where({ user_id: userId });
  }

  // Set a payment method as default
  static async setAsDefault(id: number, userId: number) {
    // First remove default status from all user payment methods
    await knex(this.tableName)
      .where({ user_id: userId })
      .update({ is_default: false });

    // Then set this one as default
    await knex(this.tableName).where({ id }).update({ is_default: true });

    return this.findById(id);
  }

  // Get user's default payment method
  static async getDefaultForUser(userId: number) {
    return knex(this.tableName)
      .where({
        user_id: userId,
        is_default: true,
      })
      .first();
  }

  // Mark payment method as verified
  static async markAsVerified(id: number) {
    await knex(this.tableName).where({ id }).update({ is_verified: true });

    return this.findById(id);
  }
}

export default PaymentMethod;
