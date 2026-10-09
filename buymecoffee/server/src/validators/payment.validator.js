import { body, checkExact } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
const createSupportOrderFields = [
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
    body("amount")
        .isInt({ min: 20, max: 500 })
        .withMessage("Amount must be a whole number between 20 and 500")
        .toInt(),
];
export const validateCreateSupportOrder = [
    ...createSupportOrderFields,
    checkExact(createSupportOrderFields, { locations: ["body"] }),
    validate,
];
//# sourceMappingURL=payment.validator.js.map