import jwt from "jsonwebtoken"
import config from "../config/config.js"


/**
 * @description Generates access and refresh tokens for a given user ID.
 * @param {string} userId - The ID of the user for whom to generate tokens.
 * @returns {Object} An object containing the generated access and refresh tokens.
 */


export const  generateToken = (userId) => {
  
    const accessToken = jwt.sign({userId},config.ACCESS_TOKEN,{expiresIn:"15min"})
    const refreshToken = jwt.sign({userId},config.REFRESH_TOKEN,{expiresIn:"7d"})

    return {
        accessToken,
        refreshToken
    }

}

export const verifyToken = (userId) => {
    const vtoken = jwt.verify(refresht)
}