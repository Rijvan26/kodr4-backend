import jwt from "jsonwebtoken"
import config from "./../config/config.js"

export function authenticate (req,res,next) {

    const token = req.headers.authorization?.split(" ")[1] //split authrization array and it has two value bearer and token acc index 0 and 1
    
    if(!token) {
        return res.status(401).json({
            message:" token not found"
        })
    }

    try {

    const decoded = jwt.verify(token,config.JWT_SECRET) // it verify token values (id,and role) with  this server assigned token
       req.user  = decoded // here we set the decoded values in req.user so that we can use it in next middleware or controller
       next() // this is used to call the next middleware or controller
    } catch (err) {
        res.status(401).json({
            message:"invalid or expired token"
        })
    }
}