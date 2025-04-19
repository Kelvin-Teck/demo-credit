// src/models/BaseModel.ts
import knex from "../database/connection";

export abstract class BaseModel {
  // Define the table name in each subclass
  protected static tableName: string;

  // Basic CRUD operations
  static async findById(id: number) {
    return knex(this.tableName).where({ id }).first();
  }

  static async findOne(filter: object) {
    return knex(this.tableName).where(filter).first();
  }

  static async findAll(filter = {}) {
    return knex(this.tableName).where(filter);
  }

  static async create(data: object) {
    const [id] = await knex(this.tableName).insert(data).returning("id");
    return this.findById(id);
  }

  static async update(id: number, data: object) {
    await knex(this.tableName).where({ id }).update(data);
    return this.findById(id);
  }

  static async delete(id: number) {
    return knex(this.tableName).where({ id }).delete();
  }
}
