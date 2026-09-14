import {body,params} from "express-validator"
import { validateRequest } from "../utils/validate"

export const createOrderValidator = [
    body("address.state").notEmpty().withMessage("state is required"),
    body("address.city").notEmpty().withMessage("city is required"),
    body("address.c").notEmpty().withMessage("landmark is required"),
    body("address.house").notEmpty().withMessage("house is required"),
    body("address.pincode").notEmpty().withMessage("pincode is required"),
    

]