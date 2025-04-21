// src/services/transactionService.ts
import Transaction from "../models/Transaction";
import Wallet from "../models/Wallet";
import knex from "../database/connection";
import { newError } from "../utils/apiResponse";
import * as validator from "../utils/validator";
import { convertToSnakeCase } from "../utils/caseConverter";
import { Request } from "express";
import { IAuthUser, IUserData } from "../interfaces";

export const fundWallet = async (req: Request) => {
  try {
    const { user } = req as Request & { user: IAuthUser }; // Get Authenticated user
    const userId = user.id;
    const { amount, paymentMethod, paymentDetails } = req.body;

    // Validate input
    const { error, value } = validator.validateWalletFunding({
      amount,
      paymentMethod,
    });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return newError(errorMessage, 403);
    }
    // Validate the amount
    if (amount <= 0) {
      return newError("Amount must be greater than zero", 400);
    }

    // process the funding

    /* Begin Transaction */
    return await knex.transaction(async (trx) => {
      try {
        // Get user wallet
        const wallet = await Wallet.findByUserId(userId, trx);

        if (!wallet) {
          return newError("Wallet not found", 404);
        }

        // Create transaction record
        const transactionData = {
          userId: userId,
          walletId: wallet.id,
          amount,
          transactionType: "deposit",
          paymentMethod,
          paymentDetails,
          description: "Wallet funding",
        };

        const transaction = await Transaction.create(
          convertToSnakeCase(transactionData),
          trx
        );

        // Update wallet balance
        const updatedWallet = await Wallet.updateBalance(
          wallet.id,
          amount,
          trx
        );

        // Update Transaction Status to "completed"

        const updatedTransaction = await Transaction.updateStatus(
          transaction.id,
          "completed",
          convertToSnakeCase(transactionData),
          trx
        );


        return {
          transaction: updatedTransaction,
          wallet: updatedWallet,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "an unknown error occured";
        return newError(errorMessage, 500);
      }
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "an unknown error occured";
    return newError(errorMessage, 500);
  }
};

