import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../../features/auth/state/authSlice"
import productReducer from "../../features/products/state/productSlice"

const store = configureStore({
    reducer:{
      auth:authReducer,
      products:productReducer
    }
})


export default store