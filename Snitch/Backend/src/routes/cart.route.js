import {Router} from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import {removeFromCartValidator,addToCartValidator} from "../validation/cart.validator.js"
import { addProductToCart, getCart, removeProductFromCart } from "../controllers/cart.controller.js"

 const router = Router()

router.use(authenticate)

/**
 * @POST /api/cart/add/product/:productId
 */

router.post("/add/product/:productId",addToCartValidator,addProductToCart)

/**
 * @DELETE /api/cart/remove/product/:productId
 */

router.delete("/remove/product/:productId",removeFromCartValidator,removeProductFromCart)


/**
 * @GET /api/cart/
 */

router.get("/", getCart)

export default router