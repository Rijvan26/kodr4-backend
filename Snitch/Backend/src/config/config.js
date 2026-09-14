import dotenv from "dotenv"
dotenv.config()


function requireVariable(name) {
    if(!process.env[name]) {
        throw new Error(`enviromental variable ${name} is required`)
    }

    return process.env[name]
}

const config =  {
    MONGO_URI:requireVariable("MONGO_URI"),
    JWT_SECRET:requireVariable("JWT_SECRET")
}

export default config