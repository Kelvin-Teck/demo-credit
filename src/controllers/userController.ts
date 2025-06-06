import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/apiResponse";
import * as UserService from "../services/userService";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await UserService.createUser(req);

    res.status(200).json(sendSuccess("User Created Succesfully", response));
  } catch (error) {

    const status =
      error instanceof Error && "code" in error ? (error as any).code : 500;
    console.log(status)
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occured";
    // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json(sendError(errorMessage, status));
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await UserService.login(req);

    res.status(200).json(sendSuccess("User Logged in Succesfully", response));
  } catch (error) {
    const status =
      error instanceof Error && "code" in error ? (error as any).code : 500;
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occured";
    // const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(status).json(sendError(errorMessage, status));
  }
};
