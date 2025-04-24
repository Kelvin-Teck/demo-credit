import { Request, Response } from "express";
import { fundWallet } from "../controllers/walletController";
import * as WalletService from "../services/walletService";
import { sendError, sendSuccess } from "../utils/apiResponse";

jest.mock("../services/walletService");
jest.mock("../utils/apiResponse");
jest.mock("../services/walletService", () => ({
  fundWallet: jest.fn(),
  transferFunds: jest.fn(),
  withdrawFunds: jest.fn(),
}));


describe("fundWallet", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: { amount: 100 },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    mockRes = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it("should return 200 and success message when wallet is funded successfully", async () => {
    const mockResponse = { balance: 200 };

      WalletService.fundWallet.mockResolvedValue(mockResponse);
      
    sendSuccess.mockReturnValue({
      success: true,
      message: "Wallet Funded Successfully",
      data: mockResponse,
    });

    await fundWallet(mockReq as Request, mockRes as Response);

    expect(WalletService.fundWallet).toHaveBeenCalledWith(mockReq);
    expect(sendSuccess).toHaveBeenCalledWith(
      "Wallet Funded Succesfully",
      mockResponse
    );
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      message: "Wallet Funded Successfully",
      data: mockResponse,
    });
  });

  it("should return 500 and error message when service throws an error", async () => {
    const error = new Error("Insufficient funds");
    WalletService.fundWallet.mockRejectedValue(error);
    sendError.mockReturnValue({
      success: false,
      message: "Insufficient funds",
      statusCode: 500,
    });

    await fundWallet(mockReq as Request, mockRes as Response);

    expect(WalletService.fundWallet).toHaveBeenCalledWith(mockReq);
    expect(sendError).toHaveBeenCalledWith("Insufficient funds", 500);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Insufficient funds",
      statusCode: 500,
    });
  });
});



import { transferFunds } from "../controllers/walletController";

jest.mock("../services/walletService");
jest.mock("../utils/apiResponse");

describe("transferFunds", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: { amount: 50, recipientId: "123" },
    };

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    mockRes = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it("should return 200 and success message when funds are transferred successfully", async () => {
    const mockResponse = { transactionId: "abc123", newBalance: 150 };

    WalletService.transferFunds.mockResolvedValue(mockResponse);

    await transferFunds(mockReq as Request, mockRes as Response);

    expect(WalletService.transferFunds).toHaveBeenCalledWith(mockReq);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(mockResponse);
  });

  it("should return 500 and error message when service throws an error", async () => {
    const error = new Error("Insufficient funds");
    WalletService.transferFunds.mockRejectedValue(error);

    await transferFunds(mockReq as Request, mockRes as Response);

    expect(WalletService.transferFunds).toHaveBeenCalledWith(mockReq);
    expect(sendError).toHaveBeenCalledWith("Insufficient funds", 500);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Insufficient funds",
      statusCode: 500,
    });
  });
});


