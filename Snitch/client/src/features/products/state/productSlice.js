import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productApi from "../api/productApi";



export const getAllProducts = createAsyncThunk(
 "products/getAllProducts",
 async(_,{rejectWithValue}) => {
    try{
        const response = await productApi.getProduct()
        return response
    } catch (err) {
        return rejectWithValue(err.message || "something went wrong")
    }
 }
)
const initialState = {
    products:[],
    isLoading:false,
    error:null
}
const productSlice = createSlice({
    name:"product",
    initialState,

    reducers:{

    },

    extraReducers: (builder) => {
           builder
              .addCase(getAllProducts.pending, (state) => {
                state.isLoading = true
              })
              .addCase(getAllProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.products = action.payload.data.products
              })
              .addCase(getAllProducts.rejected, (state) => {
                state.isLoading = false
                state.products = null
              })
    }
})


export default productSlice.reducer