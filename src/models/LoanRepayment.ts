// src/models/LoanRepayment.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { RepaymentData } from "../interfaces";

class LoanRepayment extends BaseModel {
  protected static tableName = "loan_repayments";

  // Find repayments by loan
  static async findByLoanId(loanId: number) {
    return knex(this.tableName)
      .where({ loan_id: loanId })
      .orderBy("due_date", "asc");
  }

  // Create scheduled repayments for a loan
  static async createScheduledRepayments <T>(
    loanId: number,
    totalAmount: number,
    tenure: number,
    startDate: Date
  ) : Promise<T[]>{
    const repaymentAmount = totalAmount / tenure;
    const repayments: T[] = [];

    for (let i = 0; i < tenure; i++) {
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + (i + 1) * 30); // Assuming monthly payments

      const repayment = {
        loan_id: loanId,
        amount: repaymentAmount,
        due_date: dueDate,]
        status: "pending",
      };

      const [id] = await knex(this.tableName).insert(repayment).returning("id");
      repayments.push(await this.findById(id));
    }

    return repayments;
  }

  // Mark repayment as paid
  static async markAsPaid(id: number, transactionId: number) {
    await knex(this.tableName).where({ id }).update({
      transaction_id: transactionId,
      payment_date: new Date(),
      status: "paid",
      updated_at: new Date(),
    });

    return this.findById(id);
  }

  // Get overdue repayments
  static async getOverdueRepayments() {
    const today = new Date();

    return knex(this.tableName)
      .where("status", "pending")
      .where("due_date", "<", today);
  }

  // Apply late fee to repayment
  static async applyLateFee(id: number, lateFee: number) {
    const repayment = await this.findById(id);
    if (!repayment) throw new Error("Repayment not found");

    await knex(this.tableName)
      .where({ id })
      .update({
        late_fee: lateFee,
        amount: repayment.amount + lateFee,
        updated_at: new Date(),
      });

    return this.findById(id);
  }
}

export default LoanRepayment;
