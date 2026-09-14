import {Router} from "express"
import { authenticate } from "../middleware/auth.middleware"
import { createOrderValidator } from "../validation/order.validator"
 const router = Router()

router.use(authenticate)


/**
 * @POST /api/order/
 */

router.post("/",createOrderValidator,)


export default router