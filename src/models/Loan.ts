// src/models/Loan.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { LoanData } from "../interfaces";


class Loan extends BaseModel {
  protected static tableName = "loans";

  // Find loans by user
  static async findByUserId(userId: number) {
    return knex(this.tableName).where({ user_id: userId });
  }

  // Calculate total repayment amount
  static calculateTotalRepayment(amount: number, rate: number, tenure: number) {
    const interest = (amount * rate * tenure) / (100 * 365);
    return amount + interest;
  }

  // Create a new loan with calculated repayment amount
  static async create(loanData: LoanData) {
    const { amount, interest_rate, tenure } = loanData;

    // Calculate total repayment if not provided
    if (!loanData.total_repayment_amount) {
      loanData.total_repayment_amount = this.calculateTotalRepayment(
        amount,
        interest_rate,
        tenure
      );
    }

    const [id] = await knex(this.tableName).insert(loanData).returning("id");
    return this.findById(id);
  }

  // Update loan status
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

  // Get active loans with payments due soon
  static async getUpcomingDueLoans(daysThreshold = 7) {
    const today = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(today.getDate() + daysThreshold);

    return knex(this.tableName)
      .where("status", "active")
      .where("due_date", "<=", thresholdDate)
      .where("due_date", ">=", today);
  }

  // Update loan repayment amount
  static async updateRepaymentAmount(id: number, amount: number) {
    const loan = await this.findById(id);
    if (!loan) throw new Error("Loan not found");

    const newAmountRepaid = (loan.amount_repaid || 0) + amount;
    const updateData: any = { amount_repaid: newAmountRepaid };

    // If fully repaid, update status
    if (newAmountRepaid >= loan.total_repayment_amount) {
      updateData.status = "paid";
    }

    await knex(this.tableName).where({ id }).update(updateData);

    return this.findById(id);
  }
}

export default Loan;
