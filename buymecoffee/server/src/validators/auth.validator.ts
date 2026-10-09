import { body, type ValidationChain } from "express-validator";
import { MAX_COFFEE_PRICE, MIN_COFFEE_PRICE } from "../config/constants.js";

/**
 * Validation chain for POST /auth/register.
 */
export const registerValidator: ValidationChain[] = [
    body("name")
        .isString()
        .withMessage("Name must be text")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be 2-50 characters"),
    body("username")
        .isString()
        .withMessage("Username must be text")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be 3-30 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username may contain only letters, numbers, and underscores")
        .toLowerCase(),
    body("email")
        .isString()
        .withMessage("Email must be text")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Password must be text")
        .bail()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Za-z]/)
        .withMessage("Password must contain a letter")
        .matches(/\d/)
        .withMessage("Password must contain a number"),
    body("bio")
        .optional()
        .isString()
        .withMessage("Bio must be text")
        .bail()
        .trim()
        .isLength({ max: 160 })
        .withMessage("Bio must be 160 characters or fewer"),
    body("coffeePrice")
        .notEmpty()
        .withMessage("Coffee price is required")
        .bail()
        .isInt({ min: MIN_COFFEE_PRICE, max: MAX_COFFEE_PRICE })
        .withMessage(`Coffee price must be a whole number between ${MIN_COFFEE_PRICE} and ${MAX_COFFEE_PRICE}`)
        .toInt(),
];

/**
 * Validation chain for POST /auth/login. 
 * Uses a generic message to avoid leaking which field failed.
 */
export const loginValidator: ValidationChain[] = [
    body("email")
        .isString()
        .withMessage("Invalid credentials")
        .bail()
        .trim()
        .isEmail()
        .withMessage("Invalid credentials")
        .normalizeEmail(),
    body("password")
        .isString()
        .withMessage("Invalid credentials")
        .bail()
        .notEmpty()
        .withMessage("Invalid credentials"),
];