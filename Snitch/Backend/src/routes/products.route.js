import { Router } from "express";
import {authenticate} from "../middleware/auth.middleware.js"
import { createProduct, deleteImage, getProducts, togglePublishProduct, updateProduct } from "../controllers/product.controller.js"
import { createProductValidator } from "../validation/product.validate.js"
import multer from "multer"
import { parseProductBody } from "../middleware/product.parser.js";

const upload = multer({
    storage: multer.memoryStorage(),
})



const router = Router();


/**
 * @POST /api/products
 */
router.post("/", authenticate, upload.array("images", 5),parseProductBody, createProductValidator, createProduct)

/**
 * @PATCH /api/products/update/:id
 */
router.patch("/update/:id",authenticate,upload.array("images",5),parseProductBody,createProductValidator,updateProduct)


/**
 * @DElETE /api/products/image/:id/:imageId
 */
router.delete("/image/:id/:imageId",authenticate,deleteImage)


/**
 * @PATCH /api/products/publish/:id
 */
router.patch("/publish/:id",authenticate,togglePublishProduct)

/**
 * @GET /api/products/
 */
router.get("/",getProducts)


export default router;