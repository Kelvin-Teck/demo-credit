// src/models/User.ts
import { BaseModel }  from './BaseModel'
import knex from "../database/connection";
import bcrypt from "bcrypt";
import { UserData } from "../interfaces";


class User extends BaseModel {
  protected static tableName = "users";

  // Find user by email
  static async findByEmail(email: string) {
    return knex(this.tableName).where({ email }).first();
  }

  // Create a user w
  static async create(userData: UserData) {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user with hashed password
    const [id] = await knex(this.tableName)
      .insert({
        ...userData,
        password: hashedPassword,
      })
      .returning("id");

    // Return user without password
    const user = await this.findById(id);
    delete user.password;
    return user;
  }

  // Verify user password
  static async verifyPassword(email: string, password: string) {
    const user = await knex(this.tableName).where({ email }).first();

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    // Return user without password
    delete user.password;
    return user;
  }
}

export default User;
