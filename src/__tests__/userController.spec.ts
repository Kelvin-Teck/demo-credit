// import { Request, Response } from "express";
// import { createUser } from "../controllers/userController"; // Adjust path accordingly
// import * as UserService from "../services/userService"; // Adjust path accordingly
// import { sendSuccess, sendError } from "../utils/apiResponse";
// import request from "supertest";
// import app from "../app";
// import knex from "../database/connection";

// beforeAll(async () => {
//   await knex.migrate.latest();
//   await knex.seed.run();
// });

// // ✅ Mock dependencies
// jest.mock("../services/userService");
// jest.mock("../utils/apiResponse");
// jest.mock("../services/userService", () => ({
//     login: jest.fn()
// }));

// const mockCreateUserService = UserService.createUser as jest.Mock;
// const mockLoginService = UserService.login as jest.Mock;
// const mockSendSuccess = sendSuccess as jest.Mock;
// const mockSendError = sendError as jest.Mock;

// describe("createUser controller", () => {
//   let mockReq: Partial<Request>;
//   let mockRes: Partial<Response>;
//   let statusMock: jest.Mock;
//   let jsonMock: jest.Mock;

//   beforeEach(() => {
//     mockReq = {
//       body: {
//         name: "Jane Doe",
//         email: "jane@example.com",
//         password: "secret",
//       },
//     };

//     jsonMock = jest.fn();
//     statusMock = jest.fn(() => ({ json: jsonMock }));

//     mockRes = {
//       status: statusMock,
//     };

//     jest.clearAllMocks();
//   });

//   it("should return 200 and success message when user is created", async () => {
//     const mockResponse = { id: "user_123", ...mockReq.body };

//     mockCreateUserService.mockResolvedValue(mockResponse);
//     mockSendSuccess.mockReturnValue({
//       success: true,
//       message: "User Created Succesfully",
//       data: mockResponse,
//     });

//     await createUser(mockReq as Request, mockRes as Response);

//     expect(mockCreateUserService).toHaveBeenCalledWith(mockReq);
//     expect(mockSendSuccess).toHaveBeenCalledWith(
//       "User Created Succesfully",
//       mockResponse
//     );
//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: true,
//       message: "User Created Succesfully",
//       data: mockResponse,
//     });
//   });

//   it("should return 500 and proper error message if service throws an Error", async () => {
//     const error = new Error("Database failure");

//     mockCreateUserService.mockRejectedValue(error);
//     mockSendError.mockReturnValue({
//       success: false,
//       message: "Database failure",
//       statusCode: 500,
//     });

//     await createUser(mockReq as Request, mockRes as Response);

//     expect(mockSendError).toHaveBeenCalledWith("Database failure", 500);
//     expect(statusMock).toHaveBeenCalledWith(500);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: false,
//       message: "Database failure",
//       statusCode: 500,
//     });
//   });

//   it("should return error with custom status code if available in error", async () => {
//     const error = {
//       message: "Email already exists",
//       code: 409,
//     };

//     // mockCreateUserService.mockRejectedValue(error);
//     // mockSendError.mockReturnValue({
//     //   success: false,
//     //   message: "Email already exists",
//     //   statusCode: 409,
//     // });

//     await createUser(mockReq as Request, mockRes as Response);

//     expect(mockSendError).toHaveBeenCalledWith("Email already exists", 409);
//     expect(statusMock).toHaveBeenCalledWith(500); // Your controller uses 500 hardcoded for response
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: false,
//       message: "Email already exists",
//       statusCode: 409,
//     });
//   });

//   it("should return generic error message when error is not an instance of Error", async () => {
//     const unknownError = "Something strange";

//     mockCreateUserService.mockRejectedValue(unknownError);
//     mockSendError.mockReturnValue({
//       success: false,
//       message: "An unknown error occured",
//       statusCode: 500,
//     });

//     await createUser(mockReq as Request, mockRes as Response);

//     expect(mockSendError).toHaveBeenCalledWith("An unknown error occured", 500);
//     expect(statusMock).toHaveBeenCalledWith(500);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: false,
//       message: "An unknown error occured",
//       statusCode: 500,
//     });
//   });
// });

// describe("User Login Controller", () => {
//   let mockReq: Partial<Request>;
//   let mockRes: Partial<Response>;
//   let statusMock: jest.Mock;
//   let jsonMock: jest.Mock;

//   beforeEach(() => {
//     mockReq = {
//       body: {
//         email: "test@example.com",
//         password: "password123",
//       },
//     };

//     jsonMock = jest.fn();
//     statusMock = jest.fn(() => ({ json: jsonMock }));

//     mockRes = {
//       status: statusMock,
//     };

//     jest.clearAllMocks();
//   });

//   it("should return 200 and success message when user logs in successfully", async () => {
//     const mockResponse = {
//       token: "sample-token", // Example of the token or response structure from your service
//     };

//     mockLoginService.mockResolvedValue(mockResponse);
//     mockSendSuccess.mockReturnValue({
//       success: true,
//       message: "User Logged in Successfully",
//       data: mockResponse,
//     });

//     await UserService.login(mockReq as Request);

//     expect(mockLoginService).toHaveBeenCalledWith(mockReq);
//     expect(mockSendSuccess).toHaveBeenCalledWith(
//       "User Logged in Successfully",
//       mockResponse
//     );
//     expect(statusMock).toHaveBeenCalledWith(200);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: true,
//       message: "User Logged in Successfully",
//       data: mockResponse,
//     });
//   });

//   it("should return 400 and error message when invalid credentials are provided", async () => {
//     const error = {
//       message: "Invalid email or password",
//       code: 400,
//     };

//     mockLoginService.mockRejectedValue(error);
//     mockSendError.mockReturnValue({
//       success: false,
//       message: error.message,
//       statusCode: error.code,
//     });

//     await UserService.login(mockReq as Request);

//     expect(mockLoginService).toHaveBeenCalledWith(mockReq);
//     expect(mockSendError).toHaveBeenCalledWith(error.message, error.code);
//     expect(statusMock).toHaveBeenCalledWith(400);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: false,
//       message: "Invalid email or password",
//       statusCode: 400,
//     });
//   });

//   it("should return 500 and generic error message if an unknown error occurs", async () => {
//     const error = new Error("Unknown error");

//     mockLoginService.mockRejectedValue(error);
//     mockSendError.mockReturnValue({
//       success: false,
//       message: "An unknown error occurred",
//       statusCode: 500,
//     });

//     await UserService.login(mockReq as Request);

//     expect(mockLoginService).toHaveBeenCalledWith(mockReq);
//     expect(mockSendError).toHaveBeenCalledWith(
//       "An unknown error occurred",
//       500
//     );
//     expect(statusMock).toHaveBeenCalledWith(500);
//     expect(jsonMock).toHaveBeenCalledWith({
//       success: false,
//       message: "An unknown error occurred",
//       statusCode: 500,
//     });
//   });
// });

// afterAll(async () => {
//   await knex.destroy();
// });
