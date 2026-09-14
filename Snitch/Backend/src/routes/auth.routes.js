import {Router} from "express"
const router = Router()
import {getMe, login, register} from "../controllers/auth.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"

router.post("/register", register)
router.post("/login",login)
router.get("/me",authenticate,getMe)

export default router