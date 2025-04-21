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
          amount: value.amount,
          transactionType: "deposit",
          paymentMethod: value.paymentMethod,
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

export const transferFunds = async (req: Request) => {
  try {
    const { user } = req as Request & { user: IAuthUser }; // Get Authenticated user
    const userId = user.id;
    const { recipientWalletNumber, amount, description } = req.body;

    // Validate input
    const { error, value } = validator.validateTransfer({
      recipientWalletNumber,
      amount,
      description,
    });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return newError(errorMessage, 403);
    }
    // Begin Transaction
    const result = await knex.transaction(async (trx) => {
      // Get sender's wallet
      const senderWallet = await Wallet.findByUserId(userId, trx);
      if (!senderWallet) {
        return newError("Sender's wallet not found", 404);
      }

      // Get recipient's wallet
      const recipientWallet = await Wallet.findOne(
        { wallet_number: value.recipientWalletNumber },
        trx
      );

      if (!recipientWallet) {
        return newError("Recipient wallet not found", 404);
      }

      // Check if sender is not transferring to self
      if (senderWallet.id === recipientWallet.id) {
        return newError("Cannot transfer to your own wallet", 404);
      }

      // Check if sender has sufficient funds
      if (senderWallet.balance < value.amount) {
        return newError("Insufficient funds", 402);
      }

      // Create transaction record
      const transactionData = {
        userId: userId,
        walletId: senderWallet.id,
        amount,
        transactionType: "transfer",
        status: "pending",
        sourceWalletId: senderWallet.id,
        destinationWalletId: recipientWallet.id,
        description: value.description || "Transfer",
      };

      const transaction = await Transaction.create(
        convertToSnakeCase(transactionData),
        trx
      );

      // Update sender's wallet (deduct amount)
      await Wallet.updateBalance(senderWallet.id, -amount, trx);

      // Update recipient's wallet (add amount)
      await Wallet.updateBalance(recipientWallet.id, amount, trx);

      // Update transaction status to completed
     const updatedTransaction =  await Transaction.updateStatus(transaction.id, "completed", {}, trx);

      // Return updated sender wallet and transaction
      const updatedSenderWallet = await Wallet.findById(senderWallet.id, trx);

      return {
        status: "success",
        message: "Transfer successful",
        data: {
          transaction: updatedTransaction,
          balance: updatedSenderWallet.balance,
        },
      };
    });

    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "an unknown error occured";
    return newError(errorMessage, 500);
  }
};



export const withdrawFunds = async (req: Request) => {
  
}