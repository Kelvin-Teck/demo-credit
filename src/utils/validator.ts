
import Joi from "joi";
import { IUserData } from "../interfaces";

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

export const validateUserCreation = (data: IUserData) =>  {
  const { error, value } = userCreationSchema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
  });

  return { error, value };
}