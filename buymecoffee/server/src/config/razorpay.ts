import Razorpay from "razorpay";
import { configEnv } from "./env.js";


export const razorpay = new Razorpay({
    key_id:configEnv.RAZORPAY_KEY_ID,
    key_secret:configEnv.RAZORPAY_KEY_SECRET
})