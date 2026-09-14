import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiClient } from "../../../app/api/api.instance";
import authApi from "../api/auth.api";

export const registerUser = createAsyncThunk(
    "/auth/registerUser",
    async (userData,{rejectwithValue}) => {
        try {
            const response = await authApi.register(userData)
            if(response.token) {
                localStorage.setItem("token",response.token)
            }
            return response
        } catch (error) {
            return rejectwithValue(error.message || "regiter failed")
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async(credentials,{rejectwithValue}) => {
        try {
            const response = await authApi.login(credentials)
            if(response.token) {
                localStorage.setItem("token", response.token)
            }
            return response
        } catch (error) {
            return rejectwithValue(error.message || "login failed")
        }
    }
)

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async(_,{rejectwithValue}) => {
        try {
        const response = await authApi.getMe()
        return response
    } catch (error) {
        localStorage.removeItem("token")
        return rejectwithValue(error.message || "invalid token")
    }
    }
)


const initialState = {
    user:null,
    token:null,
    isAuthenticate:false,
    isLoading:false,
    error:null
}

const authSlice = createSlice({
    name:"auth",
    initialState,

    reducers:{
        logout: (state) => {
    state.user = null,
    state.token = savedToken || null,
    state.isAuthenticate = false,
    state.isLoading = false,
    state.error = null
        },
        clearAuthError:(state) => {
            state.error = null
        }
    },

    extraReducers: (builder) => {
      builder
      .addCase(registerUser.pending,(state) => {
         state.isLoading = true,
         state.error = null
      })
     .addCase(registerUser.fulfilled,(state,action) => {
        state.isLoading = false,
        state.isAuthenticate = true
        state.token = action.payload
        state.user = action.payload
        state.error = null

     })
     .addCase(registerUser.rejected,(state,action) => {
        state.isLoading = false,
        state.isAuthenticate = false
        state.token = null
        state.user = null
        state.error = action.payload

     })

     //register
       builder
    .addCase(loginUser.pending,(state,action) => {
        state.isLoading = true,
        state.error = null
    })
    .addCase(loginUser.fulfilled,(state,action) => {
          state.isLoading = false,
        state.isAuthenticate = true
        state.token = action.payload
        state.user = action.payload
        state.error = null
    })
    .addCase(loginUser.rejected,(state,action) => {
          state.isLoading = false,
        state.isAuthenticate = false
        state.error = action.payload
        state.user = null
        state.error = null
    })

     // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
    },
  

})

export const {logout,clearAuthError} = authSlice.actions

export default authSlice.reducer