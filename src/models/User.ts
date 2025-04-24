// src/models/User.ts
import { BaseModel } from "./BaseModel";
import knex from "../database/connection";
import bcrypt from "bcrypt";
import { IUserData } from "../interfaces";

class User extends BaseModel {
  protected static tableName = "users";

  // Find user by email
  static async findByEmail(email: string) {
    return knex(this.tableName).where({ email }).first();
  }

  // Find user by phone number
  static async findByPhoneNumber(phone_number: string) {
    return knex(this.tableName).where({ phone_number }).first();
  }

  // Create a user
  static async create(userData: IUserData, trx?: any) {
    // Use the transaction if provided
    const queryBuilder = trx ? trx(this.tableName).transacting(trx) : knex(this.tableName);

    // Create user with hashed password (assuming password is already hashed)
    const [insertId] =  await queryBuilder.insert({ ...userData });

    

    return this.findById(insertId, trx);
  }

  // Verify user password
  // static async verifyPassword(email: string, password: string) {
  //   const user = await knex(this.tableName).where({ email }).first();

  //   if (!user) return null;

  //   const isPasswordValid = await bcrypt.compare(password, user.password);

  //   if (!isPasswordValid) return null;

  //   // Return user without password
  //   delete user.password;
  //   return user;
  // }
}

export default User;
