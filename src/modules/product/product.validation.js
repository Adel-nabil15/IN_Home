import joi from "joi";
import { generalRoules } from "../../utils/generalRouls/generalroules.js";

// ----------------------- addProductSchema -----------------------
export const addProductSchema = {
  body: joi
    .object({
      name: generalRoules.name.required(),
      storename: generalRoules.name.required(),
      productLink: joi.string().uri().required().messages({
        "string.uri": "product link must be a valid url",
        "any.required": "product link is required",
      }),
      affiliateLink: joi.string().uri().required().messages({
        "string.uri": "affiliate link must be a valid url",
        "any.required": "affiliate link is required",
      }),
      description: joi.string().min(3).max(1024).required(),
      price: joi.number().min(0).required(),
      quantity: joi.number().min(0).required(),
      commission: joi.number().min(0).required(),
      adSpendingHistory: joi.array().items(
        joi.object({
          date: joi.string(),
          price: joi.number().min(0).required(),
          platform: joi.string().required(),
          notes: joi.string(),
        })
      ),
      quantitySold: joi.number().min(0),
    })
    .required(),
};

// ----------------------- updateProductSchema -----------------------
export const updateProductSchema = {
  body: joi
    .object({
      name: generalRoules.name,
      storename: generalRoules.name,
      productLink: joi.string().uri().messages({
        "string.uri": "product link must be a valid url",
      }),
      affiliateLink: joi.string().uri().messages({
        "string.uri": "affiliate link must be a valid url",
      }),
      description: joi.string().min(3).max(1024),
      price: joi.number().min(0),
      quantity: joi.number().min(0),
      commission: joi.number().min(0),
      isFreezed: joi.boolean(),
      adSpendingHistory: joi.array().items(
        joi.object({
          date: joi.string(),
          price: joi.number().min(0),
          platform: joi.string(),
          notes: joi.string(),
        })
      ),
      quantitySold: joi.number().min(0),
    })

    .required(),
};
