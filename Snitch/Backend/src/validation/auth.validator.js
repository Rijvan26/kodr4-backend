import {body,query , validationResult} from 'express-validator';

export const registerValidator = [   // it make error array and it managed by express validator

    body("name").notEmpty().withMessage("name is required")
    .isLength({min:3}).withMessage("name must be atleast 3 character"),
     body("email").notEmpty().withMessage("email is required")
    .isEmail().withMessage("email not valid"),
     body("password").notEmpty().withMessage("password is required")
    .isLength({min:6}).withMessage("password must be atleast 6 character"),

    
]