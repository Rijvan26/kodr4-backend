import  type { User,RegisterData,LoginCredential,AuthResponse } from "../constant/authTypes"; 
import apiClient from "../../../app/api/apiClient";

 export const authApi = {
    register:async (userData:RegisterData) => {
       const {data} = await apiClient.post<AuthResponse>(
        "auth/registe",userData
       )

       return data
    },

    login: async (credentail:LoginCredential) => {
        const {data} = await apiClient.post<AuthResponse>(
           "auth/login", credentail
        )

        return data
    },


    getMe: async () => {
    const { data } = await apiClient.get<User>("/auth/me");

    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post("/auth/logout");

    return data;
  },
  
    response: async () => {
        const {data} = await apiClient.post<{accessToke:string}>(
          "auth/refresh"
        )

        return data
    }




}