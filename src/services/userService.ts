import { Request, Response } from "express";
import * as validator from "../utils/validator";
import { newError } from "../utils/apiResponse";
import User from "../models/User";
import * as helpers from "../utils/helpers";
import { convertToSnakeCase } from "../utils/caseConverter";
import Wallet from "../models/Wallet";
import knex from "../database/connection";
import adjutorClient from "../config/axios";
import fauxAuthService from "./fauxAuthService";
import { sendMail } from "../mailers";

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

  const isPhoneNumberExist = await User.findByPhoneNumber(
    validatedUserInput.phoneNumber
  );

  if (isPhoneNumberExist) {
    return newError("A User with this phone number already exist", 403);
  }

  // check if user is blacklisted
  const isBlacklisted = await adjutorClient.get(
    `/verification/karma/${validatedUserInput.email}`
  );

  console.log(isBlacklisted.data);

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
      await trx.commit();
      // Send email Notification
      const emailData = {
        to: newUser.email,
        subject: "Demo Credit Account Creation",
        template: "createAccount",
        context: {
          firstName: newUser.first_name,
          loginLink: "https://localhost:1000/user/login",
        },
      };
      await sendMail(emailData);
    } catch (error) {
      await trx.rollback();
      console.log(error);
      return newError("Failed to Create User", 403);
    }
  });
};

export const login = async (req: Request) => {
  const { email, password } = req.body;

  const findUser = await User.findByEmail(email);

  if (!findUser) {
    return newError("This User does not exist", 401);
  }

  const checkPassword = await helpers.comparePassword(
    password,
    findUser.password
  );

  if (!checkPassword) {
    return newError("Incorrect Password...Try Again", 403);
  }

  const { password: pass, ...safeUser } = findUser; //get user without password

  const token = fauxAuthService.generateToken(undefined, safeUser);

  // Send email Notification
  const ipAddress =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
    req.socket.remoteAddress;

  const emailData = {
    to: safeUser.email,
    subject: "Sign In Notification",
    template: "signIn",
    context: {
      firstName: safeUser.first_name,
      loginTime: new Date().toISOString(),
      securityLink: "https://demo-credit/security",
      ipAddress,
    },
  };
  await sendMail(emailData);
  return { token };
};
