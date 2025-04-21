import Joi from "joi";
import { ITransactionData, ITransfer, IUserData, WalletData } from "../interfaces";

const userCreationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  password: Joi.string().min(8).required(),
  address: Joi.string().max(255).optional(),
  dateOfBirth: Joi.date().iso().optional(),
  idNumber: Joi.string().max(20).optional(),
  verificationStatus: Joi.string()
    .valid("unverified", "pending", "verified")
    .optional(),
  isActive: Joi.boolean().optional(),
});

export const validateUserCreation = (data: IUserData) => {
  const { error, value } = userCreationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  return { error, value };
};

const walletFundingSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),
  paymentMethod: Joi.string()
    .valid("card", "bank_transfer", "ussd", "wallet")
    .required()
    .messages({
      "string.base": "Payment method must be a string",
      "any.only":
        "Payment method must be one of: card, bank_transfer, ussd, wallet",
      "any.required": "Payment method is required",
    }),
});

export const validateWalletFunding = (data: Partial<ITransactionData>) => {
  const { error, value } = walletFundingSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  return { error, value };
};

export const validateTransferSchema = Joi.object({
  recipientWalletNumber: Joi.string()
    .pattern(/^WAL-[A-Z0-9]{8}$/)
    .required()
    .messages({
      "string.empty": "Recipient wallet number is required",
      "any.required": "Recipient wallet number is required",
      "any.pattern": "Wallet number must follow the pattern WAL-XXXXXXXX with uppercase letters and digits only"
    }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be positive",
    "any.required": "Amount is required",
  }),
  description: Joi.string().optional(),
});


export const validateTransfer = (data: ITransfer) => {
  const { error, value } = validateTransferSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  return { error, value };
};