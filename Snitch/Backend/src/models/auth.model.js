import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:8
    },
     email:{
        type:String,
        required:true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        maxLength:100,
    },
     passwordHash:{
        type:String,
        required:true,
        minLength:8,
        select:false
    },
     role:{
        type:String,
        required:true,
       enum:["user","seller"],
       default:"user"
    }
})


const userModel = mongoose.model("users",userSchema)

export default userModel