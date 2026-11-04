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
    .optional({ values: "falsy" })
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
  body("socialLinks")
    .optional()
    .isObject()
    .withMessage("Social links must be an object"),
  body("socialLinks.instagram")
    .optional()
    .isString()
    .trim(),
  body("socialLinks.youtube")
    .optional()
    .isString()
    .trim(),
  body("socialLinks.twitter")
    .optional()
    .isString()
    .trim(),
  body("socialLinks.website")
    .optional()
    .isString()
    .trim(),
  body("goal")
    .optional()
    .isObject()
    .withMessage("Goal must be an object"),
  body("goal.title")
    .optional()
    .isString()
    .trim(),
  body("goal.targetAmount")
    .optional()
    .isNumeric()
    .toFloat(),
  body("goal.showGoal")
    .optional()
    .isBoolean()
    .toBoolean(),
  body("thankYouMessage")
    .optional()
    .isString()
    .trim(),
  body("allowPublicMessages")
    .optional()
    .isBoolean()
    .toBoolean(),
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
