import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import config from "./../config/config.js"
import userModel from "../models/auth.model.js"
export async function register  (req,res) {
   const {name,email,password} = req.body


   const isUserExist = await userModel.findOne({email:email})

 if(isUserExist){
    return res.status(400).json({
        message:"User already exist",
 })}

 const hashedPassword = await bcrypt.hash(password,10)

 const user = await userModel.create({
    name:name,
    email:email,
    passwordHash:hashedPassword
 })


   const token = jwt.sign({
    id:user._id,
    role:user.role
   },config.JWT_SECRET)


   res.status(201).json({
    message:"user registered successfully",
    user:{
        name:user.name,
        email:user.email
    },
    token:token
   })

}

export async function login  (req,res) {
    const {email,password} = req.body

    const errors = []

       if(!email && !email.match(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)){
    errors.push({
        message:"Email is required",
        field:"email"
    })
   }

   
   if(!password){
    errors.push({
        message:"Password is required",
        field:"password"
    })
   }

    if(errors.length > 0) {
    return res.status(400).json({
        message:"validation error",
        errors:errors
    })
   }

    const user = await  userModel.findOne({email}).select("+passwordHash")

    if(!user) {
        return res.status(400).json({
            message:"invalid email or password"
        })
    }


    const isPasswordValid =  await bcrypt.compare(password , user.passwordHash)

    if(!isPasswordValid) {
         return res.status(400).json({
            message:"invalid email or password"
        })
    }

    const token = jwt.sign({
        id:user._id,
        role:user.role
    },config.JWT_SECRET)

     res.status(200).json({
        message:"user logged in successfully",
        user:{
            id:user._id,
            user:user.name,
            email:user.email
        },
        token
    })
}



export async function getMe (req,res) {

    try{
        

    const user = await userModel.findById(req.user.id)

   return  res.status(200).json({
        message:"user fetched successfully",
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })
    } catch(err) {
        res.status(401).json({
            message:"invalid or expired token"
        })
    }
}