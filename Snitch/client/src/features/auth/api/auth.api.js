import { apiClient } from "../../../app/api/api.instance";

const authApi = {
    register: async (userData) => {
        const {data} = await apiClient.post("/auth/register",userData)

        return data
    },

    login: async (crendential) => {
        const {data} = await apiClient.post("/auth/login",crendential)
        return data
    },

    getMe: async () => {
        const {data} = await apiClient.get("/getMe")
        return data
    }
}

export default authApi