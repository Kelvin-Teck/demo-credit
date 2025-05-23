// src/services/transactionService.ts
import Transaction from "../models/Transaction";
import Wallet from "../models/Wallet";
import knex from "../database/connection";
import { newError } from "../utils/apiResponse";
import * as validator from "../utils/validator";
import { convertToSnakeCase } from "../utils/caseConverter";
import { Request } from "express";
import { IAuthUser, ITransactionData, IUserData } from "../interfaces";
import User from "../models/User";
import { sendMail } from "../mailers";

export const fundWallet = async (req: Request) => {
  try {
    const { user } = req as Request & { user: IAuthUser }; // Get Authenticated user
    const userId = user.id;
    const { amount, paymentMethod, paymentDetails } = req.body;
    console.log(userId);
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

    // Get user wallet
    const wallet = await Wallet.findByUserId(userId);

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

    // process the funding

    /* Begin Transaction */
    return await knex.transaction(async (trx) => {
      try {
        const transaction = await Transaction.create(
          convertToSnakeCase(transactionData),
          trx
        );

        // Update wallet balance
        await Wallet.updateBalance(wallet.id, amount, trx);

        const currentWallet = await Wallet.findByUserId(user.id, trx);

        // Update Transaction Status to "completed"

        const updatedTransaction = await Transaction.updateStatus(
          transaction.id,
          "completed",
          convertToSnakeCase(transactionData),
          trx
        );
        const formattedTransaction = {
          ...updatedTransaction,
          amount: parseFloat(updatedTransaction.amount),
        };
        const formattedCurrentWallet = {
          ...currentWallet,
          balance: parseFloat(currentWallet.balance),
        };

        // Send Email Notification
        const emailData = {
          to: user.email,
          subject: "Fund Wallet",
          template: "fundWallet",
          context: {
            firstName: user.first_name,
            transactionRef: formattedTransaction.reference,
            newBalance: formattedCurrentWallet.balance,
            amount: formattedTransaction.amount,
            dashboardLink: "https://demo-credit/dashboard",
          },
        };
        await sendMail(emailData);

        return {
          transaction: formattedTransaction,
          wallet: formattedCurrentWallet,
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
      throw Error(errorMessage);
    }

    // Get sender's wallet
    const senderWallet = await Wallet.findByUserId(userId);
    if (!senderWallet) {
      throw Error("Sender's wallet not found");
    }

    // Get recipient's wallet
    const recipientWallet = await Wallet.findOne({
      wallet_number: value.recipientWalletNumber,
    });

    if (!recipientWallet) {
      throw Error("Recipient wallet not found");
    }

    // Check if sender is not transferring to self
    if (senderWallet.id === recipientWallet.id) {
      throw Error("You Cannot transfer to your own wallet");
    }

    // Check if sender has sufficient funds
    if (senderWallet.balance < value.amount) {
      throw Error("Insufficient funds");
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
      convertToSnakeCase(transactionData)
    );

    // Begin Transaction
    return await knex.transaction(async (trx) => {
      // Update sender's wallet (deduct amount)
      await Wallet.updateBalance(senderWallet.id, -amount, trx);

      // Update recipient's wallet (add amount)
      await Wallet.updateBalance(recipientWallet.id, amount, trx);

      // Update transaction status to completed
      const updatedTransaction = await Transaction.updateStatus(
        transaction.id,
        "completed",
        {},
        trx
      );

      // Return updated sender wallet and transaction
      const updatedSenderWallet = await Wallet.findById(senderWallet.id, trx);

      const formattedTransaction = {
        ...updatedTransaction,
        amount: parseFloat(updatedTransaction.amount),
      };

      const recipientInfo = await User.findById(recipientWallet.user_id);

      const emailData = {
        to: user.email,
        subject: "Transfer Notification",
        template: "fundTransfer",
        context: {
          firstName: user.first_name,
          transactionRef: formattedTransaction.reference,
          newBalance: updatedSenderWallet.balance,
          amount: formattedTransaction.amount,
          recipientName: `${recipientInfo.first_name} ${recipientInfo.last_name}`,
          recipientEmail: recipientInfo.email,
          dashboardLink: "https://demo-credit/transaction",
        },
      };

      await sendMail(emailData);

      return {
        status: "success",
        message: "Transfer successful",
        data: {
          transaction: formattedTransaction,
          balance: parseFloat(updatedSenderWallet.balance),
        },
      };
    });
  } catch (error: any) {
    throw Error(error!.message ?? "an unknown error occured");
  }
};

export const withdrawFunds = async (req: Request) => {
  try {
    const { user } = req as Request & { user: IAuthUser }; // Get Authenticated
    const userId = user.id;
    const { amount, paymentMethod, bankDetails } = req.body;
    // Validate input
    const { error, value } = validator.validateWithdrawal({
      amount,
      paymentMethod,
      bankDetails,
    });

    if (error) {
      const errorMessage = error.details.map((err) => err.message).join(", ");
      return newError(errorMessage, 403);
    }

    // Check if user exists
    const findUser = await User.findById(userId);
    if (!findUser) {
      return newError("User Not Found", 404);
    }

    // Get user's wallet
    const wallet = await Wallet.findByUserId(userId);
    if (!wallet) {
      return newError("Wallet Not Found", 404);
    }

    // Check if wallet has sufficient balance
    if (wallet.balance < amount) {
      return newError("Insufficient funds in wallet", 402);
    }
    // Create transaction record
    const transactionData = convertToSnakeCase({
      userId,
      walletId: wallet.id,
      amount,
      transactionType: "withdrawal",
      status: "pending",
      paymentMethod: value.paymentMethod,
      paymentDetails: value.bankDetails,
      description: `Withdrawal of ${amount} from wallet`,
    });

    // Begin transaction
    return await knex.transaction(async (trx) => {
      try {
        const transaction = await Transaction.create(transactionData, trx);

        // Update wallet balance
        await Wallet.updateBalance(wallet.id, -amount, trx);

        /* Here you would typically integrate with a payment provider
         to process the actual withdrawal to the user's bank account*/
        const currentWallet = await Wallet.findById(wallet.id, trx);

        // Update transaction status to completed
        const updatedTransaction = await Transaction.updateStatus(
          transaction.id,
          "completed",
          {},
          trx
        );

        const formattedTransaction = {
          ...updatedTransaction,
          amount: parseFloat(updatedTransaction.amount),
        };

        const emailData = {
          to: user.email,
          subject: "Withdrawal Notification",
          template: "fundWithdrawal",
          context: {
            firstName: user.first_name,
            transactionRef: formattedTransaction.reference,
            newBalance: currentWallet.balance,
            amount: formattedTransaction.amount,
            dashboardLink: "https://demo-credit/transactions",
          },
        };

        await sendMail(emailData);

        return {
          transaction: formattedTransaction,
          newBalance: parseFloat(currentWallet.balance),
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
