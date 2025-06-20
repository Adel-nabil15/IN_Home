import joi from "joi";
import { generalRoules } from "../../utils/generalRouls/generalroules.js";

// ----------------------- SignUpSchema -----------------------
export const SignUpSchema = {
  body: joi
    .object({
      name: generalRoules.name.required(),
      email: generalRoules.email.required(),
      password: generalRoules.password.required(),
      Cpassword: generalRoules.Cpassword.required(),
      phone: joi.string().min(11).max(11).required(),
      address: joi.string().required(),
    })
    .required(),
};

// ----------------------- loginSchema -----------------------
export const loginSchema = {
  body: joi
    .object({
      email: generalRoules.email.required(),
      password: generalRoules.password.required(),
    })
    .required(),
};

// ----------------------- UpdateProfileSchema -----------------------
export const UpdateProfileSchema = {
  body: joi
    .object({
      name: joi.string().min(3).messages({
        "string.min": "name length must be at least 3 characters long",
        "any.required": "name is required",
      }),
      phone: joi.string().min(11).max(11),
      address: joi.string(),
    })
    .required(),
};

// ----------------------- UpdatePasswordSchema -----------------------
export const UpdatePasswordSchema = {
  body: joi
    .object({
      oldPassword: generalRoules.password.required(),
      newPassword: generalRoules.password.required(),
      CnewPassword: joi
        .string()
        .valid(joi.ref("newPassword"))
        .min(3)
        .max(20)
        .messages({
          "any.required": "confirm password is required",
          "any.only": "confirm password must match password",
        })
        .required(),
    })
    .required(),
};
