// src/models/AuditLog.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import { AuditLogData } from "../interfaces";

class AuditLog extends BaseModel {
  protected static tableName = "audit_logs";

  // Create a new audit log entry
  static async createLog(logData: AuditLogData) {
    const [createdLog] = await knex(this.tableName)
      .insert(logData)
      .returning("*");
    return createdLog;
  }

  // Get all logs for a specific user
  static async findByUserId(userId: number) {
    return knex(this.tableName).where({ user_id: userId });
  }

  // Get all logs for a specific action
  static async findByAction(action: string) {
    return knex(this.tableName).where({ action });
  }

  // Get logs within a date range
  static async findByDateRange(startDate: string, endDate: string) {
    return knex(this.tableName)
      .whereBetween("created_at", [startDate, endDate])
      .orderBy("created_at", "desc");
  }

  // Get recent logs (limit to X entries)
  static async getRecentLogs(limit: number = 50) {
    return knex(this.tableName).orderBy("created_at", "desc").limit(limit);
  }
}

export default AuditLog;
