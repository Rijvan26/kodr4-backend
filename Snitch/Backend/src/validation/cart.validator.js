import {body,param,query , validationResult} from 'express-validator';
import {validateRequest} from "../utils/validate.js"

export const addToCartValidator = [
    param("proudctId").isMongoId().withMessage("invalid mongo id "),

    body("size").notEmpty().withMessage("size is required")
    .isIn(["XS","S","M", "XL", "XXL"]).withMessage("invalid size please select from sizes"),

    body("quantity").notEmpty().withMessage("quantity is required")
    .isInt({min:1}).withMessage("quantity must be positive number"),


    validateRequest
]

export const removeFromCartValidator = addToCartValidator

