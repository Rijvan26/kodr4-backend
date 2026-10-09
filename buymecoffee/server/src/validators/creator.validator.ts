import { body, checkExact } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { MAX_COFFEE_PRICE, MIN_COFFEE_PRICE } from "../config/constants.js";

const editableProfileFields = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .bail()
    .trim()
    .isLength({ max: 160 })
    .withMessage("Bio must be 160 characters or fewer"),
  body("avatarUrl")
    .optional()
    .isString()
    .withMessage("Avatar URL must be a string")
    .bail()
    .trim()
    .isURL()
    .withMessage("Avatar URL must be a valid URL"),
  body("coffeePrice")
    .optional()
    .isInt({ min: MIN_COFFEE_PRICE, max: MAX_COFFEE_PRICE })
    .withMessage(`Coffee price must be a whole number between ${MIN_COFFEE_PRICE} and ${MAX_COFFEE_PRICE}`)
    .toInt(),
];

export const validateCreatorProfileUpdate = [
  checkExact(editableProfileFields, { locations: ["body"] }),
  body().custom((requestBody: unknown) => {
    return (
      requestBody !== null &&
      typeof requestBody === "object" &&
      !Array.isArray(requestBody) &&
      Object.keys(requestBody).length > 0
    );
  }).withMessage("At least one profile field is required"),
  validate,
];