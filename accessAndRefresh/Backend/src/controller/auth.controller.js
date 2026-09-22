import userModel from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/auth.utils.js"
import sessionModel from "../models/session.model.js"

export async function register(req,res) {

    const {username,email,password} = req.body

    const user = await userModel.create({
        email:email,
        username:username,
        password: await bcrypt.hash(password,12)
    })

    const tokens = generateToken(user._id)

    await sessionModel.create({
        user:user._id,
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken,12)
    })

    res.cookie("refreshToken",tokens.refreshToken,{
        httpOnly:true,
         maxAge: 7 * 24 * 60 * 60 * 1000
    })


    res.status(201).json({
        message:"register success",
        user:{
            username:user.username,
            email:user.email
        }
    })
}

export async function login(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const tokens = generateTokens(user._id)

    await sessionModel.findOneAndUpdate(
        { userId: user._id },
        { refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 12) },
        { upsert: true }
    )

    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })

    res.status(200).json({
        message: "User logged in successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken: tokens.accessToken
        }
    })

}


export async function refresh (req,res) {
    const {refreshToken} = req.cookies

    try{
        const decoded = verifyRefreshToken(refreshToken)

    const{userId} = decoded

    const session = await sessionModel.findOne({
        userId:user._id
    })

    if(!session) {

        await sessionModel.deleteMany({userId:user._id})
        return res.status(401).json({
            message:"invalid refresh token"
        })
    }

     if(!refreshToken) {
        return res.status(401).json({
            message:"refresh token not found"
        })
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken,session.refreshToken,12)

const tokens = generateToken(userId)

await sessionModel.findOneAndUpdate(
    {userId:userId},
    {refreshToken: await bcrypt.hash(tokens.refreshToken,12)},
    {upsert:true}
)

res.cookie("refreshToken", tokens.refreshToken,{
    httpOnly:true,
    maxAge: 7 * 24 * 60 * 60 * 1000
})

return res.status(200).json({
    message:"token refreshed succesfully",
    data:{
        accessToken:tokens.accessToken
    }
})

    } catch(err) {
        message:"invalid refrresh token"
    }
   
}