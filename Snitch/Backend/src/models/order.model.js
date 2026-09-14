import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    address:{
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        landmark:{
            type:String,
            required:true
        },
        house:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        }
    

    },

    products:[  // here array store multiple value 
       { // this big object all cart things
         product:{
            productId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true

        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        price:{
              amount: {
                        type: Number,
                        required: true
                    },
                    currency: {
                        type: String,
                        required: true
                    }
        },
         },

         quantity:{
            type:String,
            required:true
         },
         size:{
             type:String,
             required:true
            },
         
    }
    ],
    totalPrice:{
          amount: {
                        type: Number,
                        required: true
                    },
                    currency: {
                        type: String,
                        required: true
                    }
    },
    status:{
        type:String,
         required:true,
        enum:["PLACED","CONFIRMED","SHIPPED","CANCELLED","DELIVERED"],
        default:"PLACED"
    }
},{timestamps:true})

const orderModel = mongoose.model("orders",orderSchema)

export default orderModel