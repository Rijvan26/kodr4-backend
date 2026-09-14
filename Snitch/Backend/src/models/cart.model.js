import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    user:{
   type:mongoose.Schema.Types.ObjectId,
   required:true
    },
    products:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        quantity:{
            type:Number,
            min:1,
            reqiuired:true
        },
        size :{
            type:String,
            required:true,
            enum:["XS","S","M","L","XL","XXL"]
        }

    }]
})

const cartModel = mongoose.model("cart", cartSchema)

export default cartModel