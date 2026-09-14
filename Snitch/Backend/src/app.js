import express from "express"
import morgan from "morgan"
import authRoutes from "../src/routes/auth.routes.js"
import productRoutes from "../src/routes/products.route.js"
import cartRoutes from "../src/routes/cart.route.js"
import cors from "cors"


const app = express()
app.use(express.json())
app.use(morgan("dev"))

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}))


app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

app.use("/api/cart", cartRoutes)

export default app