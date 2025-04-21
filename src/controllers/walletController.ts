import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse";
import * as WalletService from "../services/walletService";

export const fundWallet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await WalletService.fundWallet(req);

    res.status(200).json(sendSuccess("Wallet Funded Succesfully", response));
  } catch (error) {
    const status =
      error instanceof Error && "code" in error ? (error as any).code : 500;
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occured";
    // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(status).json(sendError(errorMessage, status));
  }
};

export const transferFunds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await WalletService.transferFunds(req);

    res.status(200).json(sendSuccess("Funds Transferred Succesfully", response));
  } catch (error) {
    const status =
      error instanceof Error && "code" in error ? (error as any).code : 500;
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occured";
    // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(status).json(sendError(errorMessage, status));
  }
};


export const withdrawFunds = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await WalletService.withdrawFunds(req);

      res.status(200).json(sendSuccess("Funds Withdrawn Succesfully", response));
    } catch (error) {
      const status =
        error instanceof Error && "code" in error ? (error as any).code : 500;
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occured";
      // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(status).json(sendError(errorMessage, status));
    }
}