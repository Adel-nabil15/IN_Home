import joi from "joi";
import { Types } from "mongoose";

export const validId = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value);
  return isValid ? value : helper.message("id is not valid");
};

export const generalRoules = {
  id: joi.string().custom(validId).required(),
  name: joi.string().required().min(3).max(20).messages({
    "string.min": "name length must be at least 3 characters long",
    "any.required": "name is required",
  }),

  email: joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .min(3)
    .messages({
      "any.required": "email is required",
    }),
  password: joi.string()
    .required()
    .min(3)
    .max(20)
    .messages({
      "string.min": "password length must be at least 6 characters long",
      "any.required": "password is required",
    }),
  Cpassword: joi.string()
    .valid(joi.ref("password"))
    .required()
    .min(3)
    .max(20)
    .messages({
      "any.required": "confirm password is required",
      "any.only": "confirm password must match password",
    }),
  phone: joi.string().min(11).max(11).required(),
  address: joi.string().required(),
  Headers: joi.object({
    authorization: joi.string().required(),
    host: joi.string(),
    "Cache-Control": joi.string(),
    "Postman-Token": joi.string(),
    "User-Agent": joi.string(),
    Accept: joi.string(),
    "Accept-Encoding": joi.string(),
    Connection: joi.string(),
    "Content-Type": joi.string(),
    "Content-Length": joi.string(),
  }),
};
