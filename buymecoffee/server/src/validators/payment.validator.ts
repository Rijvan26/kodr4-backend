import { body, checkExact, type ValidationChain } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { MAX_COFFEE_QUANTITY, MIN_COFFEE_QUANTITY } from "../config/constants.js";

const createSupportOrderFields: ValidationChain[] = [
  body("creatorUsername")
    .isString()
    .withMessage("Creator username must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Creator username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Creator username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Creator username may contain only letters, numbers, and underscores")
    .toLowerCase(),
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("email")
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("coffeeQuantity")
    .isInt({ min: MIN_COFFEE_QUANTITY, max: MAX_COFFEE_QUANTITY })
    .withMessage(`Coffee quantity must be a whole number between ${MIN_COFFEE_QUANTITY} and ${MAX_COFFEE_QUANTITY}`)
    .toInt(),
];

export const validateCreateSupportOrder = [
  checkExact(createSupportOrderFields, { locations: ["body"] }),
  validate,
];