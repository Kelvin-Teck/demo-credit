import { Request, Response } from "express";
import * as validator from "../utils/validator";
import { newError } from "../utils/apiResponse";
import User from "../models/User";
import * as helpers from "../utils/helpers";
import { convertToSnakeCase } from "../utils/caseConverter";
import Wallet from "../models/Wallet";
import knex from "../database/connection";

export const createUser = async (req: Request) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    address,
    dateOfBirth,
    idNumber,
  } = req.body; //get user inputs

  // validate user inputs

  const { error, value } = validator.validateUserCreation({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    address,
    dateOfBirth,
    idNumber,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);

    return newError(errorMessages[0], 403);
  }

  const validatedUserInput = {
    firstName: value.firstName,
    lastName: value.lastName,
    email: value.email,
    phoneNumber: value.phoneNumber,
    password: value.password,
    address: value.address,
    dateOfBirth: value.dateOfBirth,
    idNumber: value.idNumber,
  };

  // check if user exists already

  const isUserExist = await User.findByEmail(email);

  if (isUserExist) {
    return newError("A User Exists with email", 403);
  }

  // check if user is blacklisted
  

  /* Begin Transaction */
  return await knex.transaction(async (trx) => {
    try {
      // Hash Password
      const hashPassword = await helpers.hashPassword(
        validatedUserInput.password
      );
      
      //  commit user into the user Table
      /* mapping to camelCase for storing in the db */

      const dataToCommit = convertToSnakeCase({
        ...validatedUserInput,
        password: hashPassword,
      });

      const newUser = await User.create(dataToCommit, trx);
      
      // create wallet for user (with 0 balance)
      const walletData = convertToSnakeCase({
        userId: newUser.id,
        balance: 0,
      });
      
      await Wallet.create(walletData, trx);
    } catch (error) {
        return newError("Failed to Create User", 403)
    }
  });
};
