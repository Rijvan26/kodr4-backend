import { Router } from "express";
import { createSupportOrder } from "../controller/payment.controller.js";
import { validateCreateSupportOrder } from "../validators/payment.validator.js";
const router = Router();
router.post("/create-order", ...validateCreateSupportOrder, createSupportOrder);
export default router;
//# sourceMappingURL=publicPayment.routes.js.map