// middleware/fauxAuth.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import FauxAuthService from "../services/fauxAuthService";
import { IAuthUser } from "../interfaces";
import { newError } from "../utils/apiResponse";
import rateLimit from 'express-rate-limit'

// Function to create and return a rate limiter middleware
export const createRateLimiter = (
  maxRequests: number,
  windowMinutes: number
) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000, // windowMinutes in milliseconds
    max: maxRequests, // limit each IP to maxRequests per windowMs
    message: {
      status: 429, // Too Many Requests
      message: "Too many login attempts, please try again later.",
    },
    handler: (req: Request, res: Response, next: NextFunction) => {
      res.status(429).json({
        error: "Too many login attempts. Please try again later.",
      });
    },
  });
};



export const fauxAuth = (requiredRole?: string) : RequestHandler=> {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

      if (!token) {
        return newError("Authorization token required", 403);
      }

      const tokenData = FauxAuthService.getTokenData(token);
      if (!tokenData) {
        return newError("Invalid or expired token", 403);
      }

      if (requiredRole && tokenData.role !== requiredRole) {
        return newError("Insufficient permissions", 403);
      }

      // Augment the Request type with our user property
      (req as Request & { user: IAuthUser }).user =
        FauxAuthService.createAuthUser(tokenData);
      next();
    } catch (error) {
       const errorMessage =
         error instanceof Error ? error.message : "an unknown error occured";
       return newError(errorMessage, 500);
    }
  };
};


