import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { LoginCredential, User } from "../constant/authTypes";
import { authApi } from "../api/auth.api";

export interface AuthState {
    user: User | null
    accessToken: string | null
    loading: boolean 
    error:string | null
}

const  initialState:AuthState =  {
     user:null,
     accessToken:null,
     loading:false,
     error:null
}

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredential, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      return await authApi.register(userData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.error = null;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload as string;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      });
  },
});

export const { logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;

