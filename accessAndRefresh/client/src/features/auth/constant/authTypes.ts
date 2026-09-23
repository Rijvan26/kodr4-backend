export interface User {
    _id:string
    name:string
    email:string
}

export interface RegisterData {
    username:string
    email:string
    password:string
}

export interface LoginCredential  {
    email:string
    password:string

}


export interface AuthResponse {
    user:User
    accessToken:string
}