import { apiClient } from "../../../app/api/api.instance";

const productApi = {
    getProduct: async() => {
        const {data} = await apiClient.get("/products")
        console.log(data)
        return data
    }
}

export default productApi