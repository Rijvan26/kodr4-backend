import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100
    },
     email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:3,
        maxlength:100
    },
     password:{
        type:String,
        required:true,
        trim:true,
        
    },
})

const userModel = mongoose.model("users",userSchema)

export default userModel